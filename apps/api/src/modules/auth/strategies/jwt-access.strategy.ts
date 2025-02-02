import { RedisService } from '@modules/redis/redis.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Config } from '@shared/config';
import { JwtPayload } from '@shared/types';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access'
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
