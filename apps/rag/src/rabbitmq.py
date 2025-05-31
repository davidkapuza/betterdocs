import aio_pika
from aio_pika.abc import AbstractIncomingMessage
from .config import config


class RabbitMQ:
    def __init__(self):
        self.connection = None
        self.channel = None

    async def connect(self):
        connection_url = f"amqp://{config.RABBITMQ_USER}:{config.RABBITMQ_PASSWORD}@{config.RABBITMQ_HOST}:{config.RABBITMQ_PORT}/"

        self.connection = await aio_pika.connect_robust(connection_url)
        self.channel = await self.connection.channel()

        await self.channel.declare_queue(config.COLLECTIONS_QUEUE_INPUT, durable=True)
        await self.channel.declare_queue(config.COLLECTIONS_QUEUE_OUTPUT, durable=True)

    async def close(self):
        if self.connection and not self.connection.is_closed:
            await self.connection.close()

    async def consume(self, queue_name: str, callback):
        if not self.channel:
            raise ConnectionError(
                "Connection not established. Call connect() first.")

        queue = await self.channel.declare_queue(queue_name, durable=True)

        async def wrapper(message: AbstractIncomingMessage):
            await callback(message)

        await queue.consume(wrapper)

    async def publish(self, queue_name: str, message: str):
        if not self.channel:
            raise ConnectionError(
                "Connection not established. Call connect() first.")

        await self.channel.default_exchange.publish(
            aio_pika.Message(
                message.encode(),
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
            ),
            routing_key=queue_name,
        )
