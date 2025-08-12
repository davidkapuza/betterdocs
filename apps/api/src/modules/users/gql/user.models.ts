import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role, UserStatus } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
});

registerEnumType(UserStatus, {
  name: 'UserStatus',
});

@ObjectType()
export class User {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Role)
  role: Role;

  @Field(() => UserStatus)
  status: UserStatus;
}
