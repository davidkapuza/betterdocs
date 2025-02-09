import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './gql';
import { UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '@modules/auth/guards';
import { ReqUser } from '@modules/auth/decorators';
import { JwtPayload } from '@shared/types';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAccessGuard)
  @Query(() => User)
  async user(@ReqUser() jwtPayload: JwtPayload): Promise<User> {
    return this.usersService.findById(jwtPayload.userId) as unknown as User;
  }
}
