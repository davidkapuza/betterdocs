import { User } from '@modules/users/gql';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Document {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => User)
  author: User;

  @Field(() => Number, { nullable: true })
  parentId?: number | null;

  @Field(() => Number)
  collectionId: number;

  @Field(() => [Document])
  children: Document[];
}
