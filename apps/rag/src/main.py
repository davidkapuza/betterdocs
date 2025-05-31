import json
import asyncio
from aio_pika.abc import AbstractIncomingMessage
from .rabbitmq import RabbitMQ
from .dtos import (
    QueryCollectionDto,
    QueryCollectionResponseDto,
    ResponseDataDto,
)
from .config import config
from .rag_service import RagService


async def main():
    rabbitmq = RabbitMQ()
    rag = RagService(config.DATABSE_URL)
    
    await rabbitmq.connect()
    await rag.initialize()
    await rag.create_vectorizer()

    asyncio.create_task(rag.process_embeddings())

    async def callback(message: AbstractIncomingMessage):
        try:
            async with message.process():
                event = json.loads(message.body.decode())
                data = event.get("data", {})

                query_collection_dto = QueryCollectionDto.from_dict(data)

                async for part in await rag.process_query(query_collection_dto.query):
                    token = part["message"]["content"]

                    response_message = QueryCollectionResponseDto(
                        pattern=config.RESPONSE_PATTERN,
                        data=ResponseDataDto(
                            userId=query_collection_dto.userId,
                            token=token,
                            completed=False,
                        ),
                    )

                    await rabbitmq.publish(
                        queue_name=config.COLLECTIONS_QUEUE_OUTPUT,
                        message=json.dumps(response_message.to_dict()),
                    )

                # Send completion message
                completion_msg = QueryCollectionResponseDto(
                    pattern=config.RESPONSE_PATTERN,
                    data=ResponseDataDto(
                        userId=query_collection_dto.userId,
                        token="",
                        completed=True
                    ),
                )

                await rabbitmq.publish(
                    queue_name=config.COLLECTIONS_QUEUE_OUTPUT,
                    message=json.dumps(completion_msg.to_dict()),
                )

        except Exception as e:
            print(f"Error processing message: {str(e)}")

    try:
        print("[*] Waiting for messages. Press CTRL+C to exit")
        await rabbitmq.consume(
            queue_name=config.COLLECTIONS_QUEUE_INPUT,
            callback=callback
        )

        await asyncio.Future()

    except KeyboardInterrupt:
        print("\nService stopped")
    finally:
        await rag.close()
        await rabbitmq.close()


if __name__ == "__main__":
    asyncio.run(main())
