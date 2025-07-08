import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '@shared/libs/prisma';
import { nestedSearch } from '@shared/utils';

@Injectable()
export class DocumentCollectionMembershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    const args = gqlContext.getArgs();

    const user = req.user ?? req.extra.user;
    const userId = user.userId;

    // For operations with documentId, check collection access through the document
    const documentId = nestedSearch(args, 'documentId');
    
    if (documentId !== undefined && typeof documentId === 'number') {
      // Get the document's collection
      const document = await this.prisma.document.findUnique({
        where: { id: documentId },
        select: { collectionId: true },
      });

      if (!document) {
        return false; // Document doesn't exist
      }

      // Check if user has access to the collection
      const collectionAccess = await this.prisma.userCollection.findUnique({
        where: {
          userId_collectionId: {
            userId,
            collectionId: document.collectionId,
          },
        },
      });

      return Boolean(collectionAccess);
    }

    // Fall back to checking collectionId directly (for create operations)
    const collectionId = nestedSearch(args, 'collectionId');
    
    if (collectionId !== undefined && typeof collectionId === 'number') {
      const collectionAccess = await this.prisma.userCollection.findUnique({
        where: {
          userId_collectionId: {
            userId,
            collectionId,
          },
        },
      });

      return Boolean(collectionAccess);
    }

    return false;
  }
}
