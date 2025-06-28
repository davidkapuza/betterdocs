from dataclasses import dataclass

import numpy as np
import pgai
import psycopg
from ollama import AsyncClient
from pgai.vectorizer import CreateVectorizer, Worker
from pgai.vectorizer.configuration import (
    ChunkingCharacterTextSplitterConfig,
    DestinationTableConfig,
    EmbeddingOllamaConfig,
    FormattingPythonTemplateConfig,
    LoadingColumnConfig,
)
from pgvector.psycopg import register_vector_async
from psycopg.rows import class_row
from psycopg_pool import AsyncConnectionPool


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
            destination=DestinationTableConfig(destination="document_embeddings"),
            loading=LoadingColumnConfig(column_name="plainContent"),
            formatting=FormattingPythonTemplateConfig(
                template="Title: $title\nContent: $chunk"
            ),
            embedding=EmbeddingOllamaConfig(
                model="nomic-embed-text",
                dimensions=768,
                base_url="http://localhost:11434",
            ),
            chunking=ChunkingCharacterTextSplitterConfig(
                chunk_size=800,
                chunk_overlap=400,
                separator=".",
                is_separator_regex=False,
            ),
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
                    (self.vectorizer_name,),
                )
                exists = await cur.fetchone()

                if exists and not exists[0]:
                    await cur.execute(
                        vectorizer_statement.encode("utf-8"),
                    )

            await conn.commit()

    async def find_relevant_chunks(
        self, client: AsyncClient, query: str, user_id: int, limit: int = 1
    ) -> list[DocumentSearchResult]:
        """
        Find the most relevant text chunks for a given query
        using vector similarity search, filtered by user's accessible collections.
        """
        response = await client.embed(
            model=self.embedding_model,
            input=query,
        )
        embedding = np.array(response["embeddings"][0])

        async with (
            self.pool.connection() as conn,
            conn.cursor(row_factory=class_row(DocumentSearchResult)) as cur,
        ):
            await cur.execute(
                """
                SELECT de.id, de.title, de.content, de.chunk, 
                       de.embedding <=> %s as distance
                FROM document_embeddings de
                INNER JOIN documents d ON de.id = d.id
                INNER JOIN user_collections uc ON d."collectionId" = uc."collectionId"
                WHERE uc."userId" = %s
                ORDER BY distance
                LIMIT %s
                """,
                (embedding, user_id, limit),
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

    async def process_query(self, query: str, user_id: int):
        """Process a query and return a chat completion generator"""
        relevant_chunks = await self.find_relevant_chunks(self.client, query, user_id)
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
            stream=True,
        )
