import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { PrismaService } from '@shared/libs/prisma';
import { DocumentsResolver } from './documents.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RAG_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5673'],
          queue: 'documents_queue',
          queueOptions: {
            durable: true,
            arguments: {
              'x-queue-mode': 'lazy',
            },
          },
        },
      },
    ]),
  ],
  providers: [
    DocumentsService,
    PrismaService,
    DocumentsResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [DocumentsService, ClientsModule],
})
export class DocumentsModule {}
