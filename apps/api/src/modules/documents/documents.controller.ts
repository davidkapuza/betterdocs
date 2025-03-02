import { Controller, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { DocumentsService } from './documents.service';
import { PubSub } from 'graphql-subscriptions';

@Controller()
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub
  ) {}

  @EventPattern('document.processed')
  async handleProcessedDocument(data: { documentId: number }) {
    await this.documentsService.updateStatus(data.documentId, 'processed');

    // TODO publish to GraphQL subscriptions to notify clients
  }

  @EventPattern('query.response')
  async queryDocument(data: {
    userId: number;
    token: string;
    completed: boolean;
  }) {
    this.pubSub.publish(`query.${data.userId}`, {
      token: data.token,
    });
  }
}
