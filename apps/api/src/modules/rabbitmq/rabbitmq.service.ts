import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { Config } from '@shared/config';

@Injectable()
export class RabbitMQService {
  constructor(private readonly configService: ConfigService<Config>) {}

  getOptions(queue: string): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('rmq.uri', { infer: true })],
        queue: queue,
      },
    };
  }
}
