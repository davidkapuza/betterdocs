import json
from .rabbitmq import RabbitMQ
from .rag_service import RagService
from dotenv import load_dotenv
from .dtos import (
    DocumentDto,
    QueryDocumentDto,
    QueryResponseDto,
    ResponseDataDto,
    ProcessedDocumentResponseDto,
    ProcessedDocumentResponseDataDto,
)

load_dotenv()


def main():
    rabbitmq = RabbitMQ()
    rag_service = RagService()
    
    def callback(channel, method, properties, body):
        try:
            event = json.loads(body)
            event_type = event.get("pattern")
            payload = event.get("data", {})

            if event_type == "document.store_content":
                document_model = DocumentDto.model_validate(payload)

                rag_service.store_document(document_model)

                message = ProcessedDocumentResponseDto(
                    pattern="document.processed",
                    data=ProcessedDocumentResponseDataDto(documentId=document_model.id),
                )

                channel.basic_publish(
                    exchange="",
                    routing_key="documents_response_queue",
                    body=json.dumps(message.to_dict()),
                )

                channel.basic_ack(method.delivery_tag)

            elif event_type == "document.update_content":
                document_model = DocumentDto.model_validate(payload)

                rag_service.update_document(document_model)

                message = ProcessedDocumentResponseDto(
                    pattern="document.processed",
                    data=ProcessedDocumentResponseDataDto(documentId=document_model.id),
                )

                channel.basic_publish(
                    exchange="",
                    routing_key="documents_response_queue",
                    body=json.dumps(message.to_dict()),
                )

                channel.basic_ack(method.delivery_tag)

            elif event_type == "query.request":
                query_document_model = QueryDocumentDto.model_validate(payload)
                channel.basic_ack(method.delivery_tag)

                token_generator = rag_service.handle_query(query_document_model.query)

                for token in token_generator:

                    message = QueryResponseDto(
                        pattern="query.response",
                        data=ResponseDataDto(
                            userId=query_document_model.userId,
                            token=token,
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
                        userId=query_document_model.userId, token="", completed=True
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
