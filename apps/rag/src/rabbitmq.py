import pika
import os


class RabbitMQ:
    def __init__(self):
        self.user = os.getenv("RABBITMQ_USER", "guest")
        self.password = os.getenv("RABBITMQ_PASSWORD", "guest")
        self.host = os.getenv("RABBITMQ_HOST", "localhost")
        self.port = int(os.getenv("RABBITMQ_PORT", 5673))
        self.connection = None
        self.channel = None
        self.connect()

    def connect(self):
        credentials = pika.PlainCredentials(self.user, self.password)
        parameters = pika.ConnectionParameters(
            host=self.host, port=self.port, credentials=credentials
        )
        self.connection = pika.BlockingConnection(parameters)
        self.channel = self.connection.channel()

        self.channel.queue_declare("collections_queue.input", durable=True)
        self.channel.queue_declare("collections_queue.output", durable=True)

    def close(self):
        if self.connection and not self.connection.is_closed:
            self.connection.close()

    def consume(self, queue_name, callback):
        if not self.channel:
            raise ConnectionError()
        self.channel.basic_consume(
            queue=queue_name, on_message_callback=callback, auto_ack=False
        )
        self.channel.start_consuming()

    def publish(self, queue_name, message):
        if not self.channel:
            raise ConnectionError()

        self.channel.basic_publish(
            exchange="",
            routing_key=queue_name,
            body=message,
            properties=pika.BasicProperties(
                delivery_mode=2,
            ),
        )
