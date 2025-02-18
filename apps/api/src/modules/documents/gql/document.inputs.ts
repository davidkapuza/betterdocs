import { InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateDocumentInput {
  @IsString()
  title: string;
  @IsString()
  content: string;
}

@InputType()
export class UpdateDocumentInput {
  @IsNumber()
  documentId: number;

  @IsString()
  content: string;
}
