import psycopg
from typing import Iterator, List
from ollama import Client, GenerateResponse
from dataclasses import dataclass

from .db import create_db_connection
from .dtos import QueryCollectionDto


@dataclass
class ChunkData:
    title: str
    chunk: str


class RagService:
    def __init__(self):
        self.client = Client(host="http://localhost:11434")

    def get_embedding(self, text: str) -> list[float]:
        response = self.client.embeddings(model="all-minilm", prompt=text)
        return response["embedding"]

    def get_relevant_chunks(
        self,
        cur: psycopg.Cursor,
        embedding: list[float],
        user_id: int,
        collection_id: int,
        limit: int = 1,
    ) -> List[ChunkData]:
        """
        Retrieve the most relevant chunks based on vector similarity.
        """
        query = """
        SELECT de.title, de.chunk
        FROM document_embeddings de
        JOIN user_collections uc ON de."collectionId" = uc."collectionId"
        WHERE uc."userId" = %s
        AND de."collectionId" = %s
        ORDER BY embedding <=> %s::vector
        LIMIT %s
        """

        cur.execute(query, (user_id, collection_id, embedding, limit))
        return [ChunkData(title=row[0], chunk=row[1]) for row in cur.fetchall()]

    def format_context(self, chunks: List[ChunkData]) -> str:
        """
        Format the chunks into a single context string.
        """
        return "\n\n".join(f"{chunk.title}:\n{chunk.chunk}" for chunk in chunks)

    def generate_rag_response(
        self, query_collection_dto: QueryCollectionDto
    ) -> Iterator[GenerateResponse]:
        """
        Generate a RAG response using pgai, Ollama embeddings, and database content.
        """
        with create_db_connection() as conn:
            with conn.cursor() as cur:
                query_embedding = self.get_embedding(query_collection_dto.query)

                relevant_chunks = self.get_relevant_chunks(
                    cur,
                    query_embedding,
                    query_collection_dto.userId,
                    query_collection_dto.collectionId,
                )

                context = self.format_context(relevant_chunks)

                prompt = f"""
                    Answer the following question only based on the given context:

                    {context}

                    Question: {query_collection_dto.query}
                    """

                return self.client.generate(
                    model="tinyllama", prompt=prompt, stream=True
                )
