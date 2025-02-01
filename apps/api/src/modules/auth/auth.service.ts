import { UsersService } from '@modules/users/users.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto, ConfirmEmailDto, SignInDto } from './dtos';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Config } from '@shared/config';
import { MailService } from '@modules/mail/mail.service';
import { Session, Status, User } from '@prisma/client';
import { SessionsService } from '@modules/sessions/sessions.service';
import { JwtAccessPayloadType, JwtRefreshPayloadType } from './types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly mailService: MailService,
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

    const session = await this.sessionsService.create(user.id);

    const { accessToken, refreshToken } = await this.getTokens({
      userId: user.id,
      role: user.role,
      sessionId: session.id,
      hash: session.hash,
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

    const session = await this.sessionsService.create(user.id);

    const { accessToken, refreshToken } = await this.getTokens({
      userId: user.id,
      role: user.role,
      sessionId: session.id,
      hash: session.hash,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(data: JwtRefreshPayloadType) {
    const session = await this.sessionsService.findById(data.sessionId);

    if (!session || session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    await this.sessionsService.updateById(session.id);

    const { accessToken, refreshToken } = await this.getTokens({
      userId: session.user.id,
      role: session.user.role,
      sessionId: session.id,
      hash: session.hash,
    });

    return {
      user: session.user,
      accessToken,
      refreshToken,
    };
  }

  private async getTokens(data: {
    userId: User['id'];
    role: User['role'];
    sessionId: Session['id'];
    hash: Session['hash'];
  }) {
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          userId: data.userId,
          role: data.role,
          sessionId: data.sessionId,
        } as JwtAccessPayloadType,
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
          sessionId: data.sessionId,
          hash: data.hash,
        } as JwtRefreshPayloadType,
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
}
