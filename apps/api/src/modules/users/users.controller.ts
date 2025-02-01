import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserResponseDto } from './dtos';
import { Request } from 'express';
import { JwtAccessPayloadType } from '@modules/auth/types';
import { ZodSerializer } from '@shared/decorators';
import { usersSchemas } from '@betterdocs/api-contracts';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('accessToken')
  @Get('me')
  @UseGuards(AuthGuard('jwt-access'))
  @HttpCode(HttpStatus.OK)
  @ZodSerializer(usersSchemas.UserResponseDtoSchema)
  async me(@Req() request: Request): Promise<UserResponseDto> {
    const jwtPayload = request.user as JwtAccessPayloadType;

    if (!jwtPayload) throw new UnauthorizedException();

    const user = await this.usersService.findById(jwtPayload.userId);

    if (!user) throw new NotFoundException();

    return user;
  }
}
