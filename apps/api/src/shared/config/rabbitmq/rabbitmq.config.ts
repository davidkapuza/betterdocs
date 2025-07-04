import { registerAs } from '@nestjs/config';
import { RabbitMQConfig } from './rabbitmq-config.type';
import { RabbitMQConfigSchema } from './rabbitmq-config.schema';

export const rabbitMQConfig = registerAs<RabbitMQConfig>('rmq', () => {
  const config = RabbitMQConfigSchema.parse(process.env);

  return {
    uri: config.RABBIT_MQ_URI,
    collectionQueueInput: config.COLLECTIONS_QUEUE_INPUT,
    collectionQueueOutput: config.COLLECTIONS_QUEUE_OUTPUT,
    responsePattern: config.RESPONSE_PATTERN,
    requestPattern: config.REQUEST_PATTERN,
  };
});
