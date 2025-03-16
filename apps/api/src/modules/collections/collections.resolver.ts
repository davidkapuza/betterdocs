import { ReqUser } from '@modules/auth/decorators';
import { JwtAccessGuard } from '@modules/auth/guards';
import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { JwtPayload } from '@shared/types';
import { CollectionsService } from './collections.service';
import { Collection, QueryCollectionInput } from './gql';
import { DocumentsService } from '@modules/documents/documents.service';
import { Document } from '@modules/documents/gql';
import { CollectionMembershipGuard } from './guards';
import { PubSub } from 'graphql-subscriptions';

// [ ] Adding members to a collection
// [ ] Removing members from a collection

@Resolver(() => Collection)
@UseGuards(JwtAccessGuard, CollectionMembershipGuard)
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

  @ResolveField('documents', () => [Document])
  async getDocuments(@Parent() collection: Collection) {
    return await this.documentsService.getCollectionDocuments(collection.id);
  }

  @Subscription(() => String, {
    resolve: (payload) => payload.token,
  })
  async queryCollection(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('queryCollectionInput') queryCollectionInput: QueryCollectionInput
  ) {
    this.collectionsService.queryCollection({
      ...queryCollectionInput,
      userId: jwtPayload.userId,
    });

    return this.pubSub.asyncIterableIterator(`query.${jwtPayload.userId}`);
  }
}
