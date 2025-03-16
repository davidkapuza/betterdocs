import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from '@shared/libs/prisma';
import { nestedSearch } from '@shared/utils';

@Injectable()
export class CollectionMembershipGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();
    const args = gqlContext.getArgs();

    const user = req.user ?? req.extra.user;
    const userId = user.userId;

    const collectionId = nestedSearch(args, 'collectionId');

    if (collectionId === undefined || typeof collectionId !== 'number')
      return false;

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
}
