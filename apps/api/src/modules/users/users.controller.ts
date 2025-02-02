import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserResponseDto } from './dtos';
import { Request } from 'express';
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
    const user = await this.usersService.findById(request.user.userId);

    if (!user) throw new NotFoundException();

    return user;
  }
}
