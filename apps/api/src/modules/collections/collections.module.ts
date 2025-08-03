import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { PrismaService } from '@shared/libs/prisma';
import { CollectionsResolver } from './collections.resolver';
import { DocumentsModule } from '@modules/documents/documents.module';
import { PubSub } from 'graphql-subscriptions';
import { RabbitMQModule } from '@modules/rabbitmq/rabbitmq.module';
import { CollectionsController } from './collections.controller';
import { MailModule } from '@modules/mail/mail.module';
import { UsersModule } from '@modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';

const COLLECTIONS_QUEUE_INPUT =
  process.env.COLLECTIONS_QUEUE_INPUT || 'collections_queue.input';

@Module({
  imports: [
    DocumentsModule,
    MailModule,
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '30d' },
    }),
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
