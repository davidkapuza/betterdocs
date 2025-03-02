import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { PrismaService } from '@shared/libs/prisma';
import { DocumentsResolver } from './documents.resolver';
import { PubSub } from 'graphql-subscriptions';
import { RabbitMQModule } from '@modules/rabbitmq/rabbitmq.module';
import { DocumentsController } from './documents.controller';

@Module({
  imports: [
    RabbitMQModule.register({
      queue: 'documents_queue',
    }),
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
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}
