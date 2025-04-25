import { User } from '@modules/users/gql';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Document {
  id: number;
  title: string;
  content: string;
  author: User;
  parentId?: number | null;
  collectionId: number;
  children: Document[];
}
