import { Module } from '@nestjs/common';
import { UsersSeederService } from './users-seeder.service';
import { PrismaService } from '@shared/libs/prisma';

@Module({
  providers: [UsersSeederService, PrismaService],
  exports: [UsersSeederService],
})
export class UsersSeederModule {}
