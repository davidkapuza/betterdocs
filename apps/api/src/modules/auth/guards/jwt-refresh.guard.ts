import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Config } from '@shared/config';
import { JwtPayload } from '@shared/types';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from '@modules/redis/redis.service';

const STRATEGY_NAME = 'jwt-refresh';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_NAME
) {
  constructor(
    configService: ConfigService<Config>,
    private readonly redisService: RedisService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('auth.refreshTokenSecret', {
        infer: true,
      }),
    });
  }

  public async validate(payload: JwtPayload): Promise<JwtPayload> {
    const isRevoked = await this.redisService.isTokenRevoked(payload.jti);

    if (isRevoked) throw new UnauthorizedException();

    return payload;
  }
}

@Injectable()
export class JwtRefreshGuard extends AuthGuard(STRATEGY_NAME) {
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
