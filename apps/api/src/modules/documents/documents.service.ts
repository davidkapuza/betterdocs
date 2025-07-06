import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/libs/prisma';
import {
  CreateDocumentInput,
  DeleteDocumentInput,
  UpdateDocumentInput,
} from './gql';
import { extractFields } from '@shared/utils';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCollectionDocuments(collectionId: number) {
    return this.prisma.document.findMany({
      where: { collectionId, parentId: null },
      include: {
        children: true,
      },
    });
  }

  async getDocumentChildren(documentId: number) {
    return this.prisma.document.findMany({
      where: {
        parentId: documentId,
      },
    });
  }

  async getDocument(documentId: number) {
    return this.prisma.document.findUnique({
      where: { id: documentId },
      include: {
        children: true,
      },
    });
  }

  async create(userId: number, createDocumentInput: CreateDocumentInput) {
    return this.prisma.document.create({
      data: {
        collectionId: createDocumentInput.collectionId,
        title: createDocumentInput.title,
        content: createDocumentInput.content,
        plainContent: extractFields(
          JSON.parse(createDocumentInput.content),
          'text'
        ),

        authorId: userId,
      },
    });
  }

  async update(userId: number, updateDocumentInput: UpdateDocumentInput) {
    const updateData: Prisma.DocumentUncheckedUpdateInput = {
      authorId: userId,
      content: updateDocumentInput.content,
      title: updateDocumentInput.title,
    };

    if (updateDocumentInput.content !== undefined) {
      updateData.plainContent = extractFields(
        JSON.parse(updateDocumentInput.content),
        'text'
      );
    }

    return this.prisma.document.update({
      where: { id: updateDocumentInput.documentId },
      data: updateData,
    });
  }

  async deleteDocument(deleteDocumentInput: DeleteDocumentInput) {
    return this.prisma.document.delete({
      where: { id: deleteDocumentInput.documentId },
    });
  }

  async getDocumentAuthor(documentId: number) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
      select: { author: true },
    });
    return document.author;
  }
}
