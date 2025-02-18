import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DocumentsService } from './documents.service';
import { CreateDocumentInput, DocumentModel, UpdateDocumentInput } from './gql';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '@modules/auth/guards';
import { ReqUser } from '@modules/auth/decorators';
import { JwtPayload } from '@shared/types';

@Resolver(() => DocumentModel)
@UseGuards(JwtAccessGuard)
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

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
}
