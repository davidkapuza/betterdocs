from langchain_community.document_loaders import TextLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document

from chromadb.config import Settings

from .dtos import DocumentDto, QueryDocumentDto


class RagService:
    def __init__(self):
        self.embeddings = OllamaEmbeddings(model="llama3.2")
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
        )

        self.client_settings = Settings(
            chroma_client_auth_provider="chromadb.auth.token.TokenAuthClientProvider",
            chroma_server_host="chromadb",
            chroma_server_http_port=8000,
        )

        self.llm = OllamaLLM(model="llama3.2")
        self.prompt = ChatPromptTemplate.from_template(
            """
            Answer the following question only based on the given context

            <context>
            {context}
            </context>

            Question: {input}
            """
        )
        self.docs_chain = create_stuff_documents_chain(self.llm, self.prompt)

    def _get_user_collection(self, user_id: int) -> Chroma:
        return Chroma(
            collection_name=f"user_{user_id}_documents",
            embedding_function=self.embeddings,
            client_settings=self.client_settings,
        )

    def store_document(self, payload: DocumentDto):
        vector_store = self._get_user_collection(payload.authorId)
        doc = Document(
            id=payload.id,
            page_content=payload.content,
            metadata=payload.model_dump(exclude={"content"}),
        )
        splits = self.text_splitter.split_documents([doc])
        vector_store.add_documents(documents=splits)

    def update_document(self, payload: DocumentDto):
        self.delete_document(payload.authorId, payload.id)
        self.store_document(payload)

    def delete_document(self, user_id: int, document_id: int):
        vector_store = self._get_user_collection(user_id)
        ids = vector_store.get(where={"id": document_id})["ids"]
        if len(ids):
            vector_store.delete(ids)

    def handle_query(self, payload: QueryDocumentDto):
        vector_store = self._get_user_collection(payload.userId)

        retriever = vector_store.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, self.docs_chain)

        response = retrieval_chain.stream({"input": payload.query})
        for chunk in response:
            if "answer" in chunk:
                yield chunk["answer"]
