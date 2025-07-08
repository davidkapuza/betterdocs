import { InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCollectionInput {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

@InputType()
export class UpdateCollectionInput {
  @IsNumber()
  collectionId: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

@InputType()
export class DeleteCollectionInput {
  @IsNumber()
  collectionId: number;
}

@InputType()
export class QueryCollectionInput {
  @IsNumber()
  collectionId: number;

  @IsString()
  query: string;
}
