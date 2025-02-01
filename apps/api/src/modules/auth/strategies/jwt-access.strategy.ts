import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Config } from '@shared/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtAccessPayloadType } from '../types';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access'
) {
  constructor(configService: ConfigService<Config>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('auth.accessTokenSecret', {
        infer: true,
      }),
    });
  }

  public validate(payload: JwtAccessPayloadType): JwtAccessPayloadType {
    if (!payload.userId) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
