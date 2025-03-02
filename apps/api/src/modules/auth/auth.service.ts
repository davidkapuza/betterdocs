import { UsersService } from '@modules/users/users.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Config } from '@shared/config';
import { MailService } from '@modules/mail/mail.service';
import { UserStatus, User } from '@prisma/client';
import { RedisService } from '@modules/redis/redis.service';
import { JwtPayload } from '@shared/types';
import { v4 as uuid } from 'uuid';
import ms from 'ms';
import { ResetPasswordInput, SignInInput, SignUpInput } from './gql';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService<Config>
  ) {}

  async signUp(signUpInput: SignUpInput): Promise<void> {
    let user = await this.usersService.findByEmail(signUpInput.email);

    if (user && user.status === UserStatus.active) {
      throw new ConflictException('User already exists');
    }

    if (!user) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(signUpInput.password, salt);

      const createUserInput = {
        ...signUpInput,
        password,
      };

      user = await this.usersService.create(createUserInput);
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

  async confirmEmail(hash: string) {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        userId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.userId;
    } catch {
      throw new UnprocessableEntityException('Invalid hash');
    }

    const user = await this.usersService.updateById(userId, {
      status: UserStatus.active,
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

  async signIn(signInInput: SignInInput) {
    const user = await this.usersService.findByEmail(signInInput.email);

    if (!user || !(await bcrypt.compare(signInInput.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === UserStatus.inactive) {
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

  async resetPasswordRequest(email: string) {
    const user = await this.usersService.findByEmail(email);

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
      to: email,
      data: {
        hash,
        expiresIn,
      },
    });
  }

  async resetPassword(resetPasswordInput: ResetPasswordInput) {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<JwtPayload>(
        resetPasswordInput.hash,
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
    const newPassword = await bcrypt.hash(resetPasswordInput.password, salt);

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
