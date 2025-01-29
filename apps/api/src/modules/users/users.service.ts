import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/libs/prisma';
import { usersTypes } from '@betterdocs/api-contracts';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: usersTypes.CreateUserInputDto) {
    return this.prisma.user.create({ data: createUserDto });
  }
}
