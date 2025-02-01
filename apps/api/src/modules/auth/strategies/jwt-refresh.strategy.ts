import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Config } from '@shared/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtRefreshPayloadType } from '../types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(configService: ConfigService<Config>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('auth.refreshTokenSecret', {
        infer: true,
      }),
    });
  }

  public validate(payload: JwtRefreshPayloadType): JwtRefreshPayloadType {
    if (!payload.sessionId) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
