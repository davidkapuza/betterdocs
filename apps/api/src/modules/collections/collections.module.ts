import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { PrismaService } from '@shared/libs/prisma';
import { CollectionsResolver } from './collections.resolver';
import { DocumentsModule } from '@modules/documents/documents.module';
import { PubSub } from 'graphql-subscriptions';
import { RabbitMQModule } from '@modules/rabbitmq/rabbitmq.module';
import { CollectionsController } from './collections.controller';

const COLLECTIONS_QUEUE_INPUT =
  process.env.COLLECTIONS_QUEUE_INPUT || 'collections_queue.input';

@Module({
  imports: [
    DocumentsModule,
    RabbitMQModule.register({
      queue: COLLECTIONS_QUEUE_INPUT,
    }),
  ],
  providers: [
    CollectionsService,
    PrismaService,
    CollectionsResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  controllers: [CollectionsController],
  exports: [CollectionsService],
})
export class CollectionsModule {}
