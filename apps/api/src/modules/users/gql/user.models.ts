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
  id: number;
  email: string;
  firstName: string;
  lastName: string;

  @Field(() => Role)
  role: Role;

  @Field(() => UserStatus)
  status: UserStatus;
}
