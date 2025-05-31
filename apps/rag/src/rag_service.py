from dataclasses import dataclass
from typing import List
import pgai
import psycopg
import numpy as np
from pgai.vectorizer import Worker
from ollama import AsyncClient
from psycopg_pool import AsyncConnectionPool
from psycopg.rows import class_row
from pgvector.psycopg import register_vector_async
from pgai.vectorizer import CreateVectorizer
from pgai.vectorizer.configuration import EmbeddingOllamaConfig, ChunkingCharacterTextSplitterConfig, FormattingPythonTemplateConfig, LoadingColumnConfig, DestinationTableConfig


@dataclass
class DocumentSearchResult:
    """
    Data class representing a search result from the vector database.
    Contains metadata about the Document and the similarity score.
    """

    id: int
    title: str
    content: str
    chunk: str
    distance: float

    def __str__(self):
        return f"""DocumentSearchResult:
    ID: {self.id}
    Title: {self.title}
    Content: {self.content[:100]}...
    Chunk: {self.chunk}
    Distance: {self.distance:.4f}"""


class RagService:
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.ollama_host = "http://localhost:11434"
        self.client = AsyncClient(self.ollama_host)
        self.embedding_model = "nomic-embed-text"
        self.query_model = "gemma3:1b"
        self.vectorizer_name = "documents_content_embedder"

    async def setup_pgvector_psycopg(self, conn: psycopg.AsyncConnection):
        await register_vector_async(conn)

    async def initialize(self):
        pgai.install(self.database_url)

        self.pool = AsyncConnectionPool(
            self.database_url,
            min_size=5,
            max_size=10,
            open=False,
            configure=self.setup_pgvector_psycopg,
        )
        await self.pool.open()

    async def create_vectorizer(self):
        """Create vectorizer for document embeddings"""

        vectorizer_statement = CreateVectorizer(
            source="documents",
            name="documents_content_embedder",
            destination=DestinationTableConfig(
                destination='document_embeddings'
            ),
            loading=LoadingColumnConfig(column_name='content'),
            embedding=EmbeddingOllamaConfig(
                model="nomic-embed-text",
                dimensions=768,
                base_url="http://localhost:11434",
            ),
            chunking=ChunkingCharacterTextSplitterConfig(
                chunk_size=800,
                chunk_overlap=400,
                separator='.',
                is_separator_regex=False
            )
        ).to_sql()

        async with self.pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    SELECT EXISTS (
                        SELECT 1
                        FROM ai.vectorizer
                        WHERE name = %s
                    )
                    """,
                    (self.vectorizer_name, )
                )
                exists = await cur.fetchone()

                if (exists and not exists[0]):
                    await cur.execute(
                        vectorizer_statement.encode('utf-8'),
                    )

            await conn.commit()

    async def find_relevant_chunks(
        self, client: AsyncClient, query: str, limit: int = 1
    ) -> List[DocumentSearchResult]:
        """
        Find the most relevant text chunks for a given query using vector similarity search.
        """
        response = await client.embed(
            model=self.embedding_model,
            input=query,
        )
        embedding = np.array(response["embeddings"][0])

        async with self.pool.connection() as conn:
            async with conn.cursor(row_factory=class_row(DocumentSearchResult)) as cur:
                await cur.execute(
                    """
                    SELECT w.id, w.title, w.content, w.chunk, w.embedding <=> %s as distance
                    FROM document_embeddings w
                    ORDER BY distance
                    LIMIT %s
                    """,
                    (embedding, limit),
                )
                return await cur.fetchall()

    async def process_embeddings(self):
        """Process document embeddings using pgai worker"""
        worker = Worker(self.database_url)
        await worker.run()

    async def close(self):
        """Close the database connection pool"""
        if self.pool:
            await self.pool.close()

    async def process_query(self, query: str):
        """Process a query and return a chat completion generator"""
        relevant_chunks = await self.find_relevant_chunks(self.client, query)
        context = "\n\n".join(
            f"{chunk.title}:\n{chunk.content}" for chunk in relevant_chunks
        )

        prompt = f"""Question: {query}

        Please use the following context to provide an accurate response:   

        {context}

        Answer:"""

        return await self.client.chat(
            model=self.query_model,
            messages=[{"role": "user", "content": prompt}],
            stream=True
        )
