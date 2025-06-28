
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Config(BaseSettings):
    """
    Configuration settings for the RAG application.
    """

    # RabbitMQ settings
    RABBITMQ_HOST: str = "localhost"
    RABBITMQ_PORT: int = 5672
    RABBITMQ_USER: str = "guest"
    RABBITMQ_PASSWORD: str = "guest"

    # RabbitMQ queue names
    COLLECTIONS_QUEUE_INPUT: str = "collections_queue.input"
    COLLECTIONS_QUEUE_OUTPUT: str = "collections_queue.output"

    # RabbitMQ patterns
    RESPONSE_PATTERN: str = "query.response"

    # Postgres DB settings
    DATABSE_URL: str = "postgresql://postgres:postgres@localhost:5432/postgres"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields not defined in the model


config = Config()
