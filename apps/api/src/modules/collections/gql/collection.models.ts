import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Document } from '@modules/documents/gql';
import { User } from '@modules/users/gql';
import { UserCollectionRole } from '@prisma/client';

// Register the enum for GraphQL
registerEnumType(UserCollectionRole, {
  name: 'UserCollectionRole',
  description: 'The role of a user in a collection',
});

@ObjectType()
export class Collection {
  @Field()
  id: number;
  
  @Field()
  name: string;
  
  @Field({ nullable: true })
  description?: string;
  
  @Field(() => [Document])
  documents: Document[];
  
  @Field(() => [CollectionMember], { nullable: true })
  members?: CollectionMember[];
}

@ObjectType()
export class CollectionMember {
  @Field(() => User)
  user: User;
  
  @Field(() => UserCollectionRole)
  role: UserCollectionRole;
  
  @Field()
  joinedAt: Date;
}

@ObjectType()
export class CollectionInvite {
  @Field()
  id: string;
  
  @Field()
  collectionId: number;
  
  @Field(() => Collection)
  collection: Collection;
  
  @Field()
  inviterEmail: string;
  
  @Field()
  inviteeEmail: string;
  
  @Field(() => UserCollectionRole)
  role: UserCollectionRole;
  
  @Field()
  token: string;
  
  @Field()
  expiresAt: Date;
  
  @Field()
  createdAt: Date;
}

@ObjectType()
export class CollectionShareLink {
  @Field()
  id: string;
  
  @Field()
  url: string;
  
  @Field()
  token: string;
  
  @Field(() => UserCollectionRole)
  role: UserCollectionRole;
  
  @Field({ nullable: true })
  expiresAt?: Date;
  
  @Field()
  createdAt: Date;
}

@ObjectType()
export class QueryResponse {
  @Field()
  token: string;
  
  @Field()
  completed: boolean;
}
