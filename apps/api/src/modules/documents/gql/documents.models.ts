import { User } from '@modules/users/gql';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DocumentModel {
  id: number;
  content: string;
  author: User;
}
