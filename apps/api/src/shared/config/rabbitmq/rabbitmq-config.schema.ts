import { z } from 'zod';

export const RabbitMQConfigSchema = z.object({
  RABBIT_MQ_URI: z.string().url(),
});
