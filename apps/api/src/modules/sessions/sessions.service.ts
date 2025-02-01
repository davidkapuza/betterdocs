import { Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import { PrismaService } from '@shared/libs/prisma';
import { getHash } from '@shared/utils';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: Session['userId']) {
    return this.prisma.session.create({
      data: {
        userId: userId,
        hash: getHash(),
      },
    });
  }

  updateById(id: Session['id']) {
    return this.prisma.session.update({
      where: {
        id,
      },
      data: {
        hash: getHash(),
      },
    });
  }

  findById(id: Session['id']) {
    return this.prisma.session.findUnique({
      where: {
        id,
      },
      include: {
        user: true
      }
    });
  }
}
