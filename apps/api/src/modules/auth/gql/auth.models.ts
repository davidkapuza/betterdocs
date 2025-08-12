import { User } from '@modules/users/gql';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TokensResponseModel {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class SignInResponseModel extends TokensResponseModel {
  @Field(() => User)
  user: User;
}
