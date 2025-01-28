from langchain_community.document_loaders import TextLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_chroma import Chroma


# Invoke chain with RAG context
llm = OllamaLLM(model="llama3.2")
## Load page content
loader = TextLoader("./data.txt")
docs = loader.load()

## Vector store things
embeddings = OllamaEmbeddings(model="llama3.2")
text_splitter = RecursiveCharacterTextSplitter()
split_documents = text_splitter.split_documents(docs)
vector_store = Chroma.from_documents(
    split_documents, embeddings, persist_directory="./.chroma"
)

## Prompt construction
prompt = ChatPromptTemplate.from_template(
    """
            Answer the following question only based on the given context
                                                    
            <context>
            {context}
            </context>
                                                    
            Question: {input}
    """
)

## Retrieve context from vector store
docs_chain = create_stuff_documents_chain(llm, prompt)
retriever = vector_store.as_retriever()
retrieval_chain = create_retrieval_chain(retriever, docs_chain)

response = retrieval_chain.invoke({"input": "TODO"})
print(response["answer"])
