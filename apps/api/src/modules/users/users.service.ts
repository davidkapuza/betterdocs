import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/libs/prisma';
import { usersTypes } from '@betterdocs/api-contracts';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: usersTypes.CreateUserInputDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
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
