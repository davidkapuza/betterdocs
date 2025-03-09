import json
from .rabbitmq import RabbitMQ
from .rag_service import RagService
from dotenv import load_dotenv
from .dtos import (
    QueryDocumentDto,
    QueryResponseDto,
    ResponseDataDto,
)

load_dotenv()


def main():
    rabbitmq = RabbitMQ()
    rag_service = RagService()

    def callback(channel, method, properties, body):
        try:
            event = json.loads(body)
            data = event.get("data", {})

            query_document_dto = QueryDocumentDto.from_dict(data)
            channel.basic_ack(method.delivery_tag)

            stream = rag_service.generate_rag_response(query_document_dto.query)

            for chunk in stream:
                message = QueryResponseDto(
                    pattern="query.response",
                    data=ResponseDataDto(
                        userId=query_document_dto.userId,
                        token=chunk["response"],
                        completed=False,
                    ),
                )

                channel.basic_publish(
                    exchange="",
                    routing_key="documents_response_queue",
                    body=json.dumps(message.to_dict()),
                )

            completion_msg = QueryResponseDto(
                pattern="query.response",
                data=ResponseDataDto(
                    userId=query_document_dto.userId, token="", completed=True
                ),
            )

            channel.basic_publish(
                exchange="",
                routing_key="documents_response_queue",
                body=json.dumps(completion_msg.to_dict()),
            )

        except Exception as e:
            print(f"Error processing message: {str(e)}")
            channel.basic_nack(method.delivery_tag, requeue=False)

    try:
        print("[*] Waiting for messages. Press CTRL+C to exit")
        rabbitmq.consume(queue_name="documents_queue", callback=callback)
    except KeyboardInterrupt:
        print("\nService stopped")
    finally:
        rabbitmq.close()


if __name__ == "__main__":
    main()
