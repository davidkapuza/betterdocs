import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  SignUpDto,
  ConfirmEmailDto,
  SignInDto,
  SignInResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordDto,
  JwtTokensResponseDtoSchema,
} from './dtos';
import { ZodSerializer } from '@shared/decorators';
import { authSchemas } from '@betterdocs/api-contracts';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    await this.authService.signUp(signUpDto);
  }

  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  @ZodSerializer(authSchemas.SignInResponseDtoSchema)
  async confirmEmail(
    @Body() confirmEmailDto: ConfirmEmailDto
  ): Promise<SignInResponseDto> {
    return this.authService.confirmEmail(confirmEmailDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ZodSerializer(authSchemas.SignInResponseDtoSchema)
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @ApiBearerAuth('refreshToken')
  @Post('refresh-tokens')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() request: Request
  ): Promise<JwtTokensResponseDtoSchema> {
    return this.authService.refreshTokens(request.user);
  }

  @Post('reset-password-request')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPasswordRequest(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto
  ) {
    await this.authService.resetPasswordRequest(resetPasswordRequestDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ZodSerializer(authSchemas.SignInResponseDtoSchema)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<SignInResponseDto> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiBearerAuth('accessToken')
  @Post('signout')
  @UseGuards(AuthGuard('jwt-access'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async signOut(@Req() request: Request) {
    await this.authService.signOut(request.user);
  }
}
