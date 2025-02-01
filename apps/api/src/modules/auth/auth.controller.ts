import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  SignUpDto,
  ConfirmEmailDto,
  SignInDto,
  SignInResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordDto,
} from './dtos';
import { ZodSerializer } from '@shared/decorators';
import { authSchemas } from '@betterdocs/api-contracts';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtRefreshPayloadType } from './types';

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
  @Post('refresh-token')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  @ZodSerializer(authSchemas.SignInResponseDtoSchema)
  async refreshToken(@Req() request: Request): Promise<SignInResponseDto> {
    const jwtPayload = request.user as JwtRefreshPayloadType;

    if (!jwtPayload) throw new UnauthorizedException();

    return this.authService.refreshToken({
      sessionId: jwtPayload.sessionId,
      hash: jwtPayload.hash,
    });
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
}
