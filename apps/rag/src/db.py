import psycopg
from pgvector.psycopg import register_vector
import os


def create_db_connection() -> psycopg.Connection:

    postgres_user = os.environ.get("POSTGRES_USER")
    postgres_password = os.environ.get("POSTGRES_PASSWORD")
    postgres_host = os.environ.get("POSTGRES_HOST")
    postgres_port = os.environ.get("POSTGRES_PORT")
    postgres_db = os.environ.get("POSTGRES_DB")

    connection_url = f"postgresql://{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}"

    conn = psycopg.connect(connection_url)
    register_vector(conn)
    return conn
