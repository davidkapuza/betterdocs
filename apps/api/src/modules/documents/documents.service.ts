import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/libs/prisma';
import { CreateDocumentInput, DocumentModel, UpdateDocumentInput } from './gql';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('documents_queue') private readonly documentsQueue: ClientProxy
  ) {}

  async getDocument(documentId: number): Promise<DocumentModel> {
    return this.prisma.document.findUnique({
      where: { id: documentId },
      include: {
        author: true,
      },
    });
  }

  async create(
    createDocumentInput: CreateDocumentInput,
    authorId: number
  ): Promise<void> {
    await this.prisma.document.create({
      data: {
        title: createDocumentInput.title,
        content: createDocumentInput.content,
        authorId,
      },
    });
  }

  async update(
    updateDocumentInput: UpdateDocumentInput,
    authorId: number
  ): Promise<void> {
    await this.prisma.document.update({
      where: { id: updateDocumentInput.documentId },
      data: {
        authorId,
        content: updateDocumentInput.content,
      },
    });
  }

  async handleQuery(query: string, userId: number) {
    this.documentsQueue.emit('query.request', {
      query,
      userId,
    });
  }

  async deleteDocument(documentId: number) {
    await this.prisma.document.delete({ where: { id: documentId } });
  }
}
