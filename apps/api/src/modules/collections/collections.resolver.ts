import { ReqUser } from '@modules/auth/decorators';
import { JwtAccessGuard } from '@modules/auth/guards';
import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { JwtPayload } from '@shared/types';
import { CollectionsService } from './collections.service';
import { Collection, CreateCollectionInput, QueryCollectionInput, QueryResponse } from './gql';
import { DocumentsService } from '@modules/documents/documents.service';
import { Document } from '@modules/documents/gql';
import { CollectionMembershipGuard } from './guards';
import { PubSub } from 'graphql-subscriptions';

// [ ] Adding members to a collection
// [ ] Removing members from a collection

@Resolver(() => Collection)
@UseGuards(JwtAccessGuard)
export class CollectionsResolver {
  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly documentsService: DocumentsService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub
  ) {}

  @Query(() => [Collection], { name: 'collections' })
  async getUserCollections(@ReqUser() jwtPayload: JwtPayload) {
    return await this.collectionsService.getUserCollections(jwtPayload.userId);
  }

  @UseGuards(CollectionMembershipGuard)
  @Query(() => Collection, { name: 'collection' })
  async getCollection(
    @Args('collectionId', { type: () => Int }) collectionId: number
  ) {
    return await this.collectionsService.getCollection(collectionId);
  }

  @ResolveField('documents', () => [Document])
  async getDocuments(@Parent() collection: Collection) {
    return await this.documentsService.getCollectionDocuments(collection.id);
  }

  @UseGuards(CollectionMembershipGuard)
  @Subscription(() => QueryResponse)
  async queryCollection(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('queryCollectionInput') queryCollectionInput: QueryCollectionInput
  ) {
    this.collectionsService.queryCollection({
      ...queryCollectionInput,
      userId: jwtPayload.userId,
    });

    const asyncIterator = this.pubSub.asyncIterableIterator(
      `query.${jwtPayload.userId}`
    );

    return {
      async next() {
        return asyncIterator.next();
      },
      async return() {
        // TODO this.collectionsService.cancelQueryForUser(jwtPayload.userId)
        if (typeof asyncIterator.return === 'function') {
          await asyncIterator.return();
        }
        return { token: '', completed: true };
      },
      async throw(error) {
        if (typeof asyncIterator.throw === 'function') {
          return asyncIterator.throw(error);
        }
        throw error;
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }

  @Mutation(() => Collection, { name: 'createCollection' })
  async createCollection(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('createCollectionInput') createCollectionInput: CreateCollectionInput
  ) {
    return await this.collectionsService.createCollection(jwtPayload.userId, createCollectionInput);
  }
}
