import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtPayload } from '@shared/types';
import { VoidResolver } from 'graphql-scalars';
import { AuthService } from './auth.service';
import { ReqUser } from './decorators';
import {
  ResetPasswordInput,
  ResetPasswordRequestArgs,
  SignInInput,
  SignInResponseModel,
  SignUpInput,
  TokensResponseModel,
} from './gql';
import { JwtAccessGuard, JwtRefreshGuard } from './guards';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => VoidResolver, { nullable: true })
  async signUp(@Args('signUpInput') signUpInput: SignUpInput): Promise<void> {
    await this.authService.signUp(signUpInput);
  }

  @Mutation(() => SignInResponseModel)
  async confirmEmail(@Args('hash') hash: string): Promise<SignInResponseModel> {
    return this.authService.confirmEmail(
      hash
    ) as unknown as SignInResponseModel;
  }

  @Mutation(() => SignInResponseModel)
  async signIn(
    @Args('signInInput') signInInput: SignInInput
  ): Promise<SignInResponseModel> {
    return this.authService.signIn(
      signInInput
    ) as unknown as SignInResponseModel;
  }

  @UseGuards(JwtRefreshGuard)
  @Mutation(() => TokensResponseModel)
  async refreshTokens(
    @ReqUser() jwtPayload: JwtPayload
  ): Promise<TokensResponseModel> {
    return this.authService.refreshTokens(jwtPayload);
  }

  @Mutation(() => VoidResolver, { nullable: true })
  async resetPasswordRequest(
    @Args()
    resetPasswordRequestArgs: ResetPasswordRequestArgs
  ): Promise<void> {
    await this.authService.resetPasswordRequest(resetPasswordRequestArgs.email);
  }

  @Mutation(() => SignInResponseModel)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput
  ): Promise<SignInResponseModel> {
    return this.authService.resetPassword(
      resetPasswordInput
    ) as unknown as SignInResponseModel;
  }

  @UseGuards(JwtAccessGuard)
  @Mutation(() => VoidResolver, { nullable: true })
  async signOut(@ReqUser() jwtPayload: JwtPayload): Promise<void> {
    await this.authService.signOut(jwtPayload);
  }
}
