from langchain_community.document_loaders import TextLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document

from chromadb.config import Settings

# # Invoke chain with RAG context
# llm = OllamaLLM(model="llama3.2")
# ## Load page content
# loader = TextLoader("./data.txt")
# docs = loader.load()

# ## Vector store things
# embeddings = OllamaEmbeddings(model="llama3.2")
# text_splitter = RecursiveCharacterTextSplitter()
# split_documents = text_splitter.split_documents(docs)
# vector_store = Chroma.from_documents(
#     split_documents, embeddings, persist_directory="./.chroma"
# )

# ## Prompt construction
# prompt = ChatPromptTemplate.from_template(
#     """
#             Answer the following question only based on the given context

#             <context>
#             {context}
#             </context>

#             Question: {input}
#     """
# )

# ## Retrieve context from vector store
# docs_chain = create_stuff_documents_chain(llm, prompt)
# retriever = vector_store.as_retriever()
# retrieval_chain = create_retrieval_chain(retriever, docs_chain)

# response = retrieval_chain.invoke({"input": "TODO"})
# print(response["answer"])


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

    def process_event(self, event):
        print("event", event)
        event_type = event.get("type")
        payload = event.get("payload", {})

        required_fields = ["id", "content", "metadata"]
        if not all(field in payload for field in required_fields):
            print("Invalid payload: missing required fields")
            return

        document_id = payload["id"]
        content = payload["content"]
        metadata = payload["metadata"]

        doc = Document(
            page_content=content,
            metadata={
                "id": document_id,
                "authorId": metadata["authorId"],
                "version": metadata["version"],
                "title": metadata.get("title"),
                "createdAt": metadata["createdAt"],
                "updatedAt": metadata["updatedAt"],
            },
        )

        split_docs = self.text_splitter.split_documents([doc])

        if event_type == "document.store_content":
            self.vector_store.add_documents(split_docs)
            print(f"Stored document {document_id} (v{metadata['version']})")

        elif event_type == "document.update_content":
            self.vector_store.delete(
                where={"id": document_id, "version": {"$lt": metadata["version"]}}
            )
            self.vector_store.add_documents(split_docs)
            print(f"Updated document {document_id} to v{metadata['version']}")

        else:
            print(f"Unknown event type: {event_type}")
