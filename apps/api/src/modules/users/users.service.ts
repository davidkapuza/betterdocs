import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/libs/prisma';
import { User } from '@prisma/client';
import { CreateUserInput } from './gql';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data: createUserInput });

      await tx.collection.create({
        data: {
          name: 'My Collection',
          description: '...',
          users: {
            create: { userId: user.id, role: 'owner' },
          },
        },
      });
      return user;
    });
  }

  async findByEmail(email: User['email']) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: User['id']) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async updateById(userId: User['id'], data: Partial<User>) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }
}
