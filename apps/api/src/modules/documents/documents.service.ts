import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/libs/prisma';
import { CreateDocumentInput, DocumentModel, UpdateDocumentInput } from './gql';
import { ClientProxy } from '@nestjs/microservices';
import { DocumentStatus } from '@prisma/client';

enum DocumentEventType {
  STORE_CONTENT = 'document.store_content',
  UPDATE_CONTENT = 'document.update_content',
  QUERY_REQUEST = 'query.request',
}

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
    const document = await this.prisma.document.create({
      data: {
        title: createDocumentInput.title,
        content: createDocumentInput.content,
        authorId,
      },
    });

    this.documentsQueue.emit(DocumentEventType.STORE_CONTENT, document);
  }

  async updateStatus(documentId: number, status: DocumentStatus) {
    await this.prisma.document.update({
      where: { id: documentId },
      data: {
        status,
      },
    });
  }

  async update(
    updateDocumentInput: UpdateDocumentInput,
    authorId: number
  ): Promise<void> {
    const document = await this.prisma.document.update({
      where: { id: updateDocumentInput.documentId },
      data: {
        authorId,
        content: updateDocumentInput.content,
        status: 'processing',
      },
    });

    this.documentsQueue.emit(DocumentEventType.UPDATE_CONTENT, document);
  }

  async handleQuery(query: string, userId: number) {
    this.documentsQueue.emit(DocumentEventType.QUERY_REQUEST, {
      query,
      userId,
    });
  }
}
