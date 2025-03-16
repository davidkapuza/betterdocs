import { InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

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
  collectionId: number;

  @IsNumber()
  documentId: number;

  @IsString()
  content: string;
}

@InputType()
export class DeleteDocumentInput {
  @IsNumber()
  collectionId: number;

  @IsNumber()
  documentId: number;
}
