import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Config } from '@shared/config';

interface RmqModuleOptions {
  queue: string;
}

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {
  static register(props: RmqModuleOptions): DynamicModule {
    const { queue } = props;
    return {
      module: RabbitMQModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: queue,
            useFactory: (configService: ConfigService<Config>) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('rmq.uri', { infer: true })],
                queue,
                queueOptions: {
                  durable: true,
                },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
