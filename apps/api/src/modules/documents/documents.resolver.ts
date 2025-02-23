import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { DocumentsService } from './documents.service';
import { CreateDocumentInput, DocumentModel, UpdateDocumentInput } from './gql';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '@modules/auth/guards';
import { ReqUser } from '@modules/auth/decorators';
import { JwtPayload } from '@shared/types';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => DocumentModel)
@UseGuards(JwtAccessGuard)
export class DocumentsResolver {
  constructor(
    private readonly documentsService: DocumentsService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub
  ) {}

  @Mutation(() => DocumentModel)
  async createDocument(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('createDocumentInput') createDocumentInput: CreateDocumentInput
  ): Promise<DocumentModel> {
    return this.documentsService.create(createDocumentInput, jwtPayload.userId);
  }

  @Mutation(() => DocumentModel)
  async updateDocument(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('updateDocumentInput') updateDocumentInput: UpdateDocumentInput
  ): Promise<DocumentModel> {
    return this.documentsService.update(updateDocumentInput, jwtPayload.userId);
  }

  @Subscription(() => String, {
    filter: (payload, variables) =>
      payload.correlationId === variables.correlationId,
    resolve: (payload) => payload.token,
  })
  async queryDocument(
    @Args('query') query: string,
    @Args('correlationId') correlationId: string
  ) {
    this.documentsService.handleQuery(query, correlationId);

    return this.pubSub.asyncIterableIterator(`query.${correlationId}`);
  }
}
