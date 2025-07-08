import { InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateDocumentInput {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsNumber()
  collectionId: number;
}

@InputType()
export class UpdateDocumentInput {
  @IsNumber()
  documentId: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}

@InputType()
export class DeleteDocumentInput {
  @IsNumber()
  documentId: number;
}

@InputType()
export class GetDocumentInput {
  @IsNumber()
  documentId: number;
}
