import { User } from '@modules/users/gql';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokensResponseModel {
  accessToken: string;
  refreshToken: string;
}

@ObjectType()
export class SignInResponseModel extends TokensResponseModel {
  user: User;
}
