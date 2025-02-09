import { RedisService } from '@modules/redis/redis.service';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Config } from '@shared/config';
import { JwtPayload } from '@shared/types';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

const STRATEGY_NAME = 'jwt-access';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_NAME
) {
  constructor(
    configService: ConfigService<Config>,
    private readonly redisService: RedisService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('auth.accessTokenSecret', {
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
export class JwtAccessGuard extends AuthGuard(STRATEGY_NAME) {
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
