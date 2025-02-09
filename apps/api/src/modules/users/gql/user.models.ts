import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role, Status } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
});

registerEnumType(Status, {
  name: 'Status',
});

@ObjectType()
export class User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Status)
  status: Status;
}
