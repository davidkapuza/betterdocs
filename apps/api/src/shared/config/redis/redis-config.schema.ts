import { z } from 'zod';

export const RedisConfigSchema = z.object({
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().min(0).max(65535).default(6379),
});
