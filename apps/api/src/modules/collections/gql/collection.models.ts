import { ObjectType } from '@nestjs/graphql';
import { Document } from '@modules/documents/gql';

@ObjectType()
export class Collection {
  id: number;
  name: string;
  description?: string;
  documents: Document[];
}

@ObjectType()
export class QueryResponse {
  token: string;
  completed: boolean;
}
