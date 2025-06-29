import {
  ExecutionContext,
  Injectable,
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
    configService: ConfigService<Config>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('auth.accessTokenSecret', {
        infer: true,
      }),
    });
  }

  public async validate(payload: JwtPayload): Promise<JwtPayload> {
    // No token revocation check - relying on JWT expiration only
    return payload;
  }
}

@Injectable()
export class JwtAccessGuard extends AuthGuard(STRATEGY_NAME) {
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();

    // For subscriptions: extract token from the context
    if (gqlContext.req?.connectionParams) {
      return {
        headers: {
          authorization: gqlContext.req.connectionParams.Authorization,
        },
      } as Request;
    }

    return gqlContext.req;
  }
}
