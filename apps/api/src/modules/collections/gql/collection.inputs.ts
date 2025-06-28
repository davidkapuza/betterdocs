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
export class QueryCollectionInput {
  @IsNumber()
  collectionId: number;

  @IsString()
  query: string;
}
