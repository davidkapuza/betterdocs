import json
from .rabbitmq import RabbitMQ
from .rag_service import RagService
from dotenv import load_dotenv
import threading

load_dotenv()


def main():
    rabbitmq = RabbitMQ()
    rag_service = RagService()

    def callback(channel, method, properties, body):
        try:
            event = json.loads(body)
            channel.basic_ack(method.delivery_tag)
            threading.Thread(
                target=rag_service.process_event, args=(event["data"],)
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
