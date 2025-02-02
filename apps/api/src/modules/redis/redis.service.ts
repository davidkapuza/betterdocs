import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '@shared/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient!: Redis;
  private readonly logger = new Logger(RedisService.name, { timestamp: true });

  constructor(private configService: ConfigService<Config>) {}

  async onModuleInit() {
    this.redisClient = new Redis({
      host: this.configService.getOrThrow('redis.host', { infer: true }),
      port: this.configService.getOrThrow('redis.port', { infer: true }),
      retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
      },
    });

    this.redisClient.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
    });
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async revokeToken(jti: string, expiresIn: number): Promise<void> {
    await this.redisClient.setex(`revoked:${jti}`, expiresIn, '');
  }

  async isTokenRevoked(jti: string): Promise<boolean> {
    const result = await this.redisClient.exists(`revoked:${jti}`);
    return result === 1;
  }
}
