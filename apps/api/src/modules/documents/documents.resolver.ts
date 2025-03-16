import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { DocumentsService } from './documents.service';
import {
  CreateDocumentInput,
  DeleteDocumentInput,
  Document,
  UpdateDocumentInput,
} from './gql';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '@modules/auth/guards';
import { ReqUser } from '@modules/auth/decorators';
import { JwtPayload } from '@shared/types';
import { User } from '@modules/users/gql';
import { CollectionMembershipGuard } from '@modules/collections/guards';

// [ ] Versioning documents

@Resolver(() => Document)
@UseGuards(JwtAccessGuard, CollectionMembershipGuard)
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Mutation(() => Document)
  async createDocument(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('createDocumentInput') createDocumentInput: CreateDocumentInput
  ) {
    return this.documentsService.create(jwtPayload.userId, createDocumentInput);
  }

  @Mutation(() => Document)
  async updateDocument(
    @ReqUser() jwtPayload: JwtPayload,
    @Args('updateDocumentInput') updateDocumentInput: UpdateDocumentInput
  ) {
    return this.documentsService.update(jwtPayload.userId, updateDocumentInput);
  }

  @Mutation(() => Document)
  async deleteDocument(
    @Args('deleteDocumentInput') deleteDocumentInput: DeleteDocumentInput
  ) {
    return this.documentsService.deleteDocument(deleteDocumentInput);
  }

  @Query(() => Document, { name: 'document' })
  async getDocument(@Args('documentId') documentId: number) {
    return this.documentsService.getDocument(documentId);
  }

  @ResolveField('author', () => User)
  async getDocuments(@Parent() document: Document) {
    return this.documentsService.getDocumentAuthor(document.id);
  }
}
