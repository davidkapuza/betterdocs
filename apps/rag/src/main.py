import json
from .rabbitmq import RabbitMQ
from .rag_service import RagService
from dotenv import load_dotenv
import threading

load_dotenv()


def main():
    rabbitmq = RabbitMQ()
    rag_service = RagService()

    def process_query_stream(query, reply_to, correlation_id):
        thread_rabbitmq = RabbitMQ()
        try:
            token_generator = rag_service.handle_query(query)
            for token in token_generator:

                message = {
                    "type": "query.response",
                    "payload": {"correlation_id": correlation_id, "token": token},
                }
                thread_rabbitmq.publish(
                    queue_name=reply_to, message=json.dumps(message)
                )

            completion_msg = {
                "type": "query.completed",
                "payload": {"correlation_id": correlation_id},
            }
            thread_rabbitmq.publish(
                queue_name=reply_to, message=json.dumps(completion_msg)
            )
        except Exception as e:
            print(f"Error processing query: {str(e)}")
        finally:
            thread_rabbitmq.close()

    def callback(channel, method, properties, body):
        try:
            event = json.loads(body).get("data")
            channel.basic_ack(method.delivery_tag)
            event_type = event.get("type")
            payload = event.get("payload", {})

            if event_type == "query.request":
                query = payload.get("query")
                reply_to = payload.get("reply_to")
                correlation_id = payload.get("correlation_id")
                if not all([query, reply_to, correlation_id]):
                    print("Invalid query request payload")
                    return
                threading.Thread(
                    target=process_query_stream, args=(query, reply_to, correlation_id)
                ).start()
            else:
                threading.Thread(
                    target=rag_service.process_event, args=(event.get("data"),)
                ).start()
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
