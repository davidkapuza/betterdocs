import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '@shared/libs/prisma';
import { CreateCollectionInput, QueryCollectionInput, UpdateCollectionInput, DeleteCollectionInput } from './gql';
import { ConfigService } from '@nestjs/config';
import { Config } from '@shared/config';

const COLLECTIONS_QUEUE_INPUT =
  process.env.COLLECTIONS_QUEUE_INPUT || 'collections_queue.input';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(COLLECTIONS_QUEUE_INPUT)
    private readonly documentsQueue: ClientProxy,
    private readonly configService: ConfigService<Config>
  ) {}

  async getUserCollections(userId: number) {
    const col = await this.prisma.collection.findMany({
      where: { users: { some: { userId } } },
    });
    return col;
  }

  async getCollection(collectionId: number) {
    const col = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });
    return col;
  }

  async createCollection(userId: number, createCollectionInput: CreateCollectionInput) {
    return this.prisma.collection.create({
      data: {
        name: createCollectionInput.name,
        description: createCollectionInput.description,
        users: {
          create: {
            userId,
            role: 'owner',
          },
        },
      },
    });
  }

  async updateCollection(updateCollectionInput: UpdateCollectionInput) {
    const updateData: { name?: string; description?: string } = {};
    
    if (updateCollectionInput.name !== undefined) {
      updateData.name = updateCollectionInput.name;
    }
    
    if (updateCollectionInput.description !== undefined) {
      updateData.description = updateCollectionInput.description;
    }

    return this.prisma.collection.update({
      where: { id: updateCollectionInput.collectionId },
      data: updateData,
    });
  }

  async deleteCollection(deleteCollectionInput: DeleteCollectionInput) {
    // First, delete all documents in the collection
    await this.prisma.document.deleteMany({
      where: { collectionId: deleteCollectionInput.collectionId },
    });

    // Then delete all user-collection relationships
    await this.prisma.userCollection.deleteMany({
      where: { collectionId: deleteCollectionInput.collectionId },
    });

    // Finally, delete the collection itself
    return this.prisma.collection.delete({
      where: { id: deleteCollectionInput.collectionId },
    });
  }

  async queryCollection(
    queryCollectionInput: QueryCollectionInput & { userId: number }
  ) {
    this.documentsQueue.emit(
      this.configService.get('rmq.requestPattern', { infer: true }),
      queryCollectionInput
    );
  }
}
