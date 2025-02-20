import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '@shared/libs/prisma';
import { CreateDocumentInput, UpdateDocumentInput } from './gql';
import { ClientProxy } from '@nestjs/microservices';
import { PubSub } from 'graphql-subscriptions';
import * as amqp from 'amqplib';

enum DocumentEventType {
  STORE_CONTENT = 'document.store_content',
  UPDATE_CONTENT = 'document.update_content',
  QUERY_REQUEST = 'query.request',
  QUERY_RESPONSE = 'query.response',
}

interface QueryEvent {
  type: DocumentEventType;
  payload: {
    query: string;
    correlation_id: string;
    reply_to: string;
  };
}

interface DocumentEvent {
  type: DocumentEventType;
  payload: {
    id: number;
    content: string;
    metadata: {
      authorId: number;
      version: number;
      title?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

@Injectable()
export class DocumentsService implements OnModuleInit {
  private rmqChannel: amqp.Channel;
  private readonly replyQueue = 'query_responses';

  constructor(
    private readonly prisma: PrismaService,
    @Inject('RAG_SERVICE') private readonly ragService: ClientProxy,
    @Inject('PUB_SUB') private readonly pubSub: PubSub
  ) {}

  async onModuleInit() {
    await this.setupResponseConsumer();
  }

  async create(createDocumentInput: CreateDocumentInput, authorId: number) {
    return this.prisma.$transaction(async (tx) => {
      const document = await tx.document.create({
        data: {
          title: createDocumentInput.title,
          authorId,
        },
        include: {
          author: true,
        },
      });

      await tx.documentVersion.create({
        data: {
          version: 1,
          content: createDocumentInput.content,
          documentId: document.id,
          authorId,
        },
      });

      this.publishDocumentEvent({
        type: DocumentEventType.STORE_CONTENT,
        payload: {
          id: document.id,
          content: createDocumentInput.content,
          metadata: {
            authorId,
            version: 1,
            title: createDocumentInput.title,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
          },
        },
      });

      return document;
    });
  }

  async update(updateDocumentInput: UpdateDocumentInput, authorId: number) {
    const latestVersion = await this.prisma.documentVersion.findFirst({
      where: { documentId: updateDocumentInput.documentId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    if (!latestVersion) throw new NotFoundException();

    const newVersion = latestVersion.version + 1;

    return await this.prisma.$transaction(async (tx) => {
      const document = await tx.document.update({
        where: { id: updateDocumentInput.documentId },
        data: {
          authorId,
        },
        include: {
          author: true,
        },
      });

      await tx.documentVersion.create({
        data: {
          version: newVersion,
          content: updateDocumentInput.content,
          documentId: updateDocumentInput.documentId,
          authorId,
        },
      });

      this.publishDocumentEvent({
        type: DocumentEventType.UPDATE_CONTENT,
        payload: {
          id: document.id,
          content: updateDocumentInput.content,
          metadata: {
            authorId,
            version: newVersion,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
          },
        },
      });

      return document;
    });
  }

  async handleQuery(query: string, correlationId: string) {
    const event: QueryEvent = {
      type: DocumentEventType.QUERY_REQUEST,
      payload: {
        query,
        correlation_id: correlationId,
        reply_to: this.replyQueue,
      },
    };

    this.ragService.emit('documents.query', event);
  }

  private publishDocumentEvent(event: DocumentEvent) {
    this.ragService.emit('documents.content', event);
  }

  private async setupResponseConsumer() {
    try {
      const connection = await amqp.connect('amqp://localhost:5673');
      this.rmqChannel = await connection.createChannel();

      await this.rmqChannel.assertQueue(this.replyQueue, {
        durable: true,
        arguments: {
          'x-queue-mode': 'lazy',
        },
      });

      this.rmqChannel.consume(this.replyQueue, (msg) => {
        if (msg) {
          const content = JSON.parse(msg.content.toString());
          if (content.type === DocumentEventType.QUERY_RESPONSE) {
            this.pubSub.publish(`query.${content.payload.correlation_id}`, {
              correlationId: content.payload.correlation_id,
              token: content.payload.token,
            });
          }
          this.rmqChannel.ack(msg);
        }
      });
    } catch (err) {
      console.error('Failed to initialize RabbitMQ consumer:', err);
    }
  }
}
