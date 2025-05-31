import { Module } from '@nestjs/common';
import { DocumentsSeederService } from './documents-seeder.service';
import { PrismaService } from '@shared/libs/prisma';

@Module({
  providers: [DocumentsSeederService, PrismaService],
  exports: [DocumentsSeederService],
})
export class DocumentsSeederModule {}
