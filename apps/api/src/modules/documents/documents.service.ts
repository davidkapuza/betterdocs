import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@shared/libs/prisma';
import { CreateDocumentInput, UpdateDocumentInput } from './gql';
import { ClientProxy } from '@nestjs/microservices';

enum DocumentEventType {
  STORE_CONTENT = 'document.store_content',
  UPDATE_CONTENT = 'document.update_content',
}

interface DocumentEvent {
  type: DocumentEventType;
  payload: {
    id: number;
    content: string;
    metadata: {
      authorId: number;
      version: number;
      title?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('RAG_SERVICE') private readonly ragService: ClientProxy
  ) {}

  async create(createDocumentInput: CreateDocumentInput, authorId: number) {
    return this.prisma.$transaction(async (tx) => {
      const document = await tx.document.create({
        data: {
          title: createDocumentInput.title,
          authorId,
        },
        include: {
          author: true,
        },
      });

      await tx.documentVersion.create({
        data: {
          version: 1,
          content: createDocumentInput.content,
          documentId: document.id,
          authorId,
        },
      });

      this.publishDocumentEvent({
        type: DocumentEventType.STORE_CONTENT,
        payload: {
          id: document.id,
          content: createDocumentInput.content,
          metadata: {
            authorId,
            version: 1,
            title: createDocumentInput.title,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
          },
        },
      });

      return document;
    });
  }

  async update(updateDocumentInput: UpdateDocumentInput, authorId: number) {
    const latestVersion = await this.prisma.documentVersion.findFirst({
      where: { documentId: updateDocumentInput.documentId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    if (!latestVersion) throw new NotFoundException();

    const newVersion = latestVersion.version + 1;

    return await this.prisma.$transaction(async (tx) => {
      const document = await tx.document.update({
        where: { id: updateDocumentInput.documentId },
        data: {
          authorId,
        },
        include: {
          author: true,
        },
      });

      await tx.documentVersion.create({
        data: {
          version: newVersion,
          content: updateDocumentInput.content,
          documentId: updateDocumentInput.documentId,
          authorId,
        },
      });

      this.publishDocumentEvent({
        type: DocumentEventType.UPDATE_CONTENT,
        payload: {
          id: document.id,
          content: updateDocumentInput.content,
          metadata: {
            authorId,
            version: newVersion,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
          },
        },
      });

      return document;
    });
  }

  private publishDocumentEvent(event: DocumentEvent) {
    this.ragService.emit('documents.content', event);
  }
}
