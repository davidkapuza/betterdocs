import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { UserCollectionRole } from '@prisma/client';

// Register the enum for GraphQL
registerEnumType(UserCollectionRole, {
  name: 'UserCollectionRole',
  description: 'The role of a user in a collection',
});

@InputType()
export class CreateCollectionInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}

@InputType()
export class UpdateCollectionInput {
  @Field()
  @IsNumber()
  collectionId: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}

@InputType()
export class DeleteCollectionInput {
  @Field()
  @IsNumber()
  collectionId: number;
}

@InputType()
export class QueryCollectionInput {
  @Field()
  @IsNumber()
  collectionId: number;

  @Field()
  @IsString()
  query: string;
}

@InputType()
export class InviteUserToCollectionInput {
  @Field()
  @IsNumber()
  collectionId: number;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => UserCollectionRole)
  @IsEnum(UserCollectionRole)
  role: UserCollectionRole;
}

@InputType()
export class AcceptCollectionInviteInput {
  @Field()
  @IsString()
  inviteToken: string;
}

@InputType()
export class RemoveUserFromCollectionInput {
  @Field()
  @IsNumber()
  collectionId: number;

  @Field()
  @IsNumber()
  userId: number;
}

@InputType()
export class GenerateCollectionShareLinkInput {
  @Field()
  @IsNumber()
  collectionId: number;

  @Field(() => UserCollectionRole)
  @IsEnum(UserCollectionRole)
  role: UserCollectionRole;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  expiresInDays?: number;
}
