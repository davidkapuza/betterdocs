import { z } from 'zod';

export const RabbitMQConfigSchema = z.object({
  RABBIT_MQ_URI: z.string().url(),
  COLLECTIONS_QUEUE_INPUT: z.string(),
  COLLECTIONS_QUEUE_OUTPUT: z.string(),
  RESPONSE_PATTERN: z.string(),
  REQUEST_PATTERN: z.string(),
});
