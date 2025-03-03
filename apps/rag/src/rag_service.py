from langchain_community.document_loaders import TextLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document

from chromadb.config import Settings

from .dtos import DocumentDto


class RagService:
    def __init__(self):
        self.embeddings = OllamaEmbeddings(model="llama3.2")
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            separators=["\n\n", "\n", "。", "!", "?", ";", ",", " "],
        )

        self.client_settings = Settings(
            chroma_client_auth_provider="chromadb.auth.token.TokenAuthClientProvider",
            chroma_server_host="chromadb",
            chroma_server_http_port=8000,
        )

        self.vector_store = Chroma(
            collection_name="documents",
            embedding_function=self.embeddings,
            client_settings=self.client_settings,
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
        self.retriever = self.vector_store.as_retriever()
        self.retrieval_chain = create_retrieval_chain(self.retriever, self.docs_chain)

    def store_document(self, payload: DocumentDto):
        doc = Document(
            id=payload.id,
            page_content=payload.content,
            metadata=payload.model_dump(exclude={"content"}),
        )
        splits = self.text_splitter.split_documents([doc])
        self.vector_store.add_documents(documents=splits)

    def update_document(self, payload: DocumentDto):
        self.delete_document(payload.id)
        self.store_document(payload)

    def delete_document(self, document_id: int):
        ids = self.vector_store.get(where={"id": document_id})["ids"]

        if len(ids):
            self.vector_store.delete(ids)

    def handle_query(self, query):
        docs = self.retriever.invoke(query)

        context = "\n\n".join([doc.page_content for doc in docs])
        formatted_prompt = self.prompt.format(context=context, input=query)

        stream = self.llm.stream(formatted_prompt)
        for token in stream:
            yield token
