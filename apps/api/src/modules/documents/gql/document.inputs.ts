import { InputType, Field } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateDocumentInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  content: string;

  @Field()
  @IsNumber()
  collectionId: number;
}

@InputType()
export class UpdateDocumentInput {
  @Field()
  @IsNumber()
  documentId: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string;
}

@InputType()
export class DeleteDocumentInput {
  @Field()
  @IsNumber()
  documentId: number;
}

@InputType()
export class GetDocumentInput {
  @Field()
  @IsNumber()
  documentId: number;
}
