import { UsersService } from '@modules/users/users.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  SignUpDto,
  ConfirmEmailDto,
  SignInDto,
  ResetPasswordRequestDto,
  ResetPasswordDto,
} from './dtos';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Config } from '@shared/config';
import { MailService } from '@modules/mail/mail.service';
import { Status, User } from '@prisma/client';
import { RedisService } from '@modules/redis/redis.service';
import { JwtPayload } from '@shared/types';
import { v4 as uuid } from 'uuid';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<Config>
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    let user = await this.usersService.findByEmail(signUpDto.email);

    if (user && user.status === Status.active) {
      throw new ConflictException('User already exists');
    }

    if (!user) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(signUpDto.password, salt);

      const createUserDto = {
        ...signUpDto,
        password,
      };

      user = await this.usersService.create(createUserDto);
    }

    const hash = await this.jwtService.signAsync(
      {
        userId: user.id,
      },
      {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow(
          'auth.confirmEmailExpiration',
          {
            infer: true,
          }
        ),
      }
    );

    await this.mailService.sendSignUpConfirmation({
      to: user.email,
      data: {
        hash,
      },
    });
  }

  async confirmEmail(confirmEmailDto: ConfirmEmailDto) {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        userId: User['id'];
      }>(confirmEmailDto.hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.userId;
    } catch {
      throw new UnprocessableEntityException('Invalid hash');
    }

    const user = await this.usersService.updateById(userId, {
      status: Status.active,
    });

    const { accessToken, refreshToken } = await this.generateTokens({
      userId: user.id,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email);

    if (!user || !(await bcrypt.compare(signInDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === Status.inactive) {
      throw new ForbiddenException('Email confirmation is awaited');
    }

    const { accessToken, refreshToken } = await this.generateTokens({
      userId: user.id,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(data: JwtPayload) {
    await this.revokeTokens(data.jti);

    const { accessToken, refreshToken } = await this.generateTokens(data);

    return {
      accessToken,
      refreshToken,
    };
  }

  async resetPasswordRequest(resetPasswordRequestDto: ResetPasswordRequestDto) {
    const user = await this.usersService.findByEmail(
      resetPasswordRequestDto.email
    );

    if (!user) {
      throw new UnprocessableEntityException('User does not exist');
    }

    const expiresIn = this.configService.getOrThrow(
      'auth.resetPasswordTokenExpiration',
      {
        infer: true,
      }
    );

    const hash = await this.jwtService.signAsync(
      {
        userId: user.id,
      } as JwtPayload,
      {
        secret: this.configService.getOrThrow('auth.resetPasswordTokenSecret', {
          infer: true,
        }),
        expiresIn,
      }
    );

    await this.mailService.sendResetPasswordConfirmation({
      to: resetPasswordRequestDto.email,
      data: {
        hash,
        expiresIn,
      },
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<JwtPayload>(
        resetPasswordDto.hash,
        {
          secret: this.configService.getOrThrow(
            'auth.resetPasswordTokenSecret',
            {
              infer: true,
            }
          ),
        }
      );

      userId = jwtData.userId;
    } catch {
      throw new UnprocessableEntityException('Invalid hash');
    }

    const salt = await bcrypt.genSalt();
    const newPassword = await bcrypt.hash(resetPasswordDto.password, salt);

    const user = await this.usersService.updateById(userId, {
      password: newPassword,
    });

    const { accessToken, refreshToken } = await this.generateTokens({
      userId: user.id,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async signOut(data: JwtPayload) {
    await this.revokeTokens(data.jti);
  }

  private async generateTokens(data: Pick<JwtPayload, 'userId'>) {
    const jti = uuid();

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          userId: data.userId,
          jti,
        },
        {
          secret: this.configService.getOrThrow('auth.accessTokenSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow(
            'auth.accessTokenExpiration',
            {
              infer: true,
            }
          ),
        }
      ),
      await this.jwtService.signAsync(
        {
          userId: data.userId,
          jti,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshTokenSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow(
            'auth.refreshTokenExpiration',
            {
              infer: true,
            }
          ),
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async revokeTokens(jti: string) {
    // Using longer expiration time
    const refreshTokenExpiration = this.configService.getOrThrow(
      'auth.refreshTokenExpiration',
      {
        infer: true,
      }
    );

    const expirationInSeconds = ms(refreshTokenExpiration) / 1000;

    await this.redisService.revokeToken(jti, expirationInSeconds);
  }
}
