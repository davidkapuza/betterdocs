import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { DocumentsService } from './documents.service';
import { CreateDocumentInput, DocumentModel, UpdateDocumentInput } from './gql';
import { Inject, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '@modules/auth/guards';
import { ReqUser } from '@modules/auth/decorators';
import { JwtPayload } from '@shared/types';
import { PubSub } from 'graphql-subscriptions';
import { VoidResolver } from 'graphql-scalars';

@Resolver(() => DocumentModel)
@UseGuards(JwtAccessGuard)
export class DocumentsResolver {
  constructor(
    private readonly documentsService: DocumentsService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub
  ) {}

  @Mutation(() => VoidResolver, { nullable: true })
  async createDocument(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('createDocumentInput') createDocumentInput: CreateDocumentInput
  ): Promise<void> {
    await this.documentsService.create(createDocumentInput, jwtPayload.userId);
  }

  @Mutation(() => VoidResolver, { nullable: true })
  async updateDocument(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('updateDocumentInput') updateDocumentInput: UpdateDocumentInput
  ): Promise<void> {
    await this.documentsService.update(updateDocumentInput, jwtPayload.userId);
  }

  @Mutation(() => VoidResolver, { nullable: true })
  async deleteDocument(@Args('documentId') documentId: number): Promise<void> {
    await this.documentsService.deleteDocument(documentId);
  }

  @Query(() => DocumentModel)
  async getDocument(
    @Args('documentId') documentId: number
  ): Promise<DocumentModel> {
    return this.documentsService.getDocument(documentId);
  }

  @Subscription(() => String, {
    resolve: (payload) => payload.token,
  })
  async queryDocument(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('query') query: string
  ) {
    this.documentsService.handleQuery(query, jwtPayload.userId);

    return this.pubSub.asyncIterableIterator(`query.${jwtPayload.userId}`);
  }
}
