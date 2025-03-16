import { InputType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class QueryCollectionInput {
  @IsNumber()
  collectionId: number;

  @IsString()
  query: string;
}
