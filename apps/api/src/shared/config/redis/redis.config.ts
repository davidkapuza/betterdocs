import { registerAs } from '@nestjs/config';
import { RedisConfig } from './redis-config.type';
import { RedisConfigSchema } from './redis-config.schema';

export const redisConfig = registerAs<RedisConfig>('redis', () => {
  const config = RedisConfigSchema.parse(process.env);

  return {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  };
});
