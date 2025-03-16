import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { PrismaService } from '@shared/libs/prisma';
import { DocumentsResolver } from './documents.resolver';

@Module({
  providers: [DocumentsService, PrismaService, DocumentsResolver],
  exports: [DocumentsService],
})
export class DocumentsModule {}
