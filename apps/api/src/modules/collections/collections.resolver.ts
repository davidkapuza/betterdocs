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
import { Collection, CreateCollectionInput, QueryCollectionInput, QueryResponse, UpdateCollectionInput, DeleteCollectionInput, InviteUserToCollectionInput, AcceptCollectionInviteInput, RemoveUserFromCollectionInput, GenerateCollectionShareLinkInput, CollectionInvite, CollectionShareLink, CollectionMember } from './gql';
import { DocumentsService } from '@modules/documents/documents.service';
import { Document } from '@modules/documents/gql';
import { DocumentCollectionMembershipGuard } from './guards';
import { PubSub } from 'graphql-subscriptions';

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

  @UseGuards(DocumentCollectionMembershipGuard)
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

  @UseGuards(DocumentCollectionMembershipGuard)
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

  @Mutation(() => Collection, { name: 'updateCollection' })
  @UseGuards(DocumentCollectionMembershipGuard)
  async updateCollection(
    @Args('updateCollectionInput') updateCollectionInput: UpdateCollectionInput
  ) {
    return await this.collectionsService.updateCollection(updateCollectionInput);
  }

  @Mutation(() => Collection, { name: 'deleteCollection' })
  @UseGuards(DocumentCollectionMembershipGuard)
  async deleteCollection(
    @Args('deleteCollectionInput') deleteCollectionInput: DeleteCollectionInput
  ) {
    return await this.collectionsService.deleteCollection(deleteCollectionInput);
  }

  @Mutation(() => CollectionInvite, { name: 'inviteUserToCollection' })
  @UseGuards(DocumentCollectionMembershipGuard)
  async inviteUserToCollection(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('inviteUserToCollectionInput') inviteInput: InviteUserToCollectionInput
  ) {
    return await this.collectionsService.inviteUserToCollection(jwtPayload.userId, inviteInput);
  }

  @Mutation(() => Collection, { name: 'acceptCollectionInvite' })
  async acceptCollectionInvite(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('acceptCollectionInviteInput') acceptInput: AcceptCollectionInviteInput
  ) {
    return await this.collectionsService.acceptCollectionInvite(jwtPayload.userId, acceptInput);
  }

  @Mutation(() => CollectionShareLink, { name: 'generateCollectionShareLink' })
  @UseGuards(DocumentCollectionMembershipGuard)
  async generateCollectionShareLink(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('generateCollectionShareLinkInput') shareLinkInput: GenerateCollectionShareLinkInput
  ) {
    return await this.collectionsService.generateCollectionShareLink(jwtPayload.userId, shareLinkInput);
  }

  @Mutation(() => Collection, { name: 'joinCollectionByShareLink' })
  async joinCollectionByShareLink(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('token') token: string
  ) {
    return await this.collectionsService.joinCollectionByShareLink(jwtPayload.userId, token);
  }

  @Mutation(() => CollectionMember, { name: 'removeUserFromCollection' })
  @UseGuards(DocumentCollectionMembershipGuard)
  async removeUserFromCollection(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('removeUserFromCollectionInput') removeInput: RemoveUserFromCollectionInput
  ) {
    return await this.collectionsService.removeUserFromCollection(jwtPayload.userId, removeInput);
  }

  @Query(() => [CollectionMember], { name: 'collectionMembers' })
  @UseGuards(DocumentCollectionMembershipGuard)
  async getCollectionMembers(
    @Args('collectionId', { type: () => Int }) collectionId: number
  ) {
    return await this.collectionsService.getCollectionMembers(collectionId);
  }

  @Query(() => [CollectionInvite], { name: 'collectionPendingInvites' })
  @UseGuards(DocumentCollectionMembershipGuard)
  async getPendingInvites(
    @Args('collectionId', { type: () => Int }) collectionId: number
  ) {
    return await this.collectionsService.getPendingInvites(collectionId);
  }

  @Query(() => [CollectionShareLink], { name: 'collectionShareLinks' })
  @UseGuards(DocumentCollectionMembershipGuard)
  async getCollectionShareLinks(
    @Args('collectionId', { type: () => Int }) collectionId: number
  ) {
    return await this.collectionsService.getCollectionShareLinks(collectionId);
  }

  @Mutation(() => CollectionShareLink, { name: 'deleteCollectionShareLink' })
  async deleteShareLink(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('shareLinkId') shareLinkId: string
  ) {
    return await this.collectionsService.deleteShareLink(jwtPayload.userId, shareLinkId);
  }

  @ResolveField('members', () => [CollectionMember])
  async getMembers(@Parent() collection: Collection) {
    return await this.collectionsService.getCollectionMembers(collection.id);
  }
}
