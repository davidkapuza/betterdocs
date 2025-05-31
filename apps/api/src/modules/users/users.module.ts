import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '@shared/libs/prisma';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [UsersService, PrismaService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
