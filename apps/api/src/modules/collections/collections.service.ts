import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '@shared/libs/prisma';
import { QueryCollectionInput } from './gql';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('collections_queue.input')
    private readonly documentsQueue: ClientProxy
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

  async queryCollection(
    queryCollectionInput: QueryCollectionInput & { userId: number }
  ) {
    this.documentsQueue.emit('query.request', queryCollectionInput);
  }
}
