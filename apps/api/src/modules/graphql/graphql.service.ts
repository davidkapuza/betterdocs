import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@modules/redis/redis.service';
import { Context } from 'graphql-ws';
import { JwtPayload } from '@shared/types';

@Injectable()
export class GraphQLService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService
  ) {}

  async handleSubscriptionConnection(
    context: Context<Record<string, string>, { user: JwtPayload }>
  ): Promise<void> {
    const { connectionParams, extra } = context;

    const token = this.extractToken(connectionParams);

    if (!token) throw new Error('Missing token');

    const secret = this.configService.get('auth.accessTokenSecret', {
      infer: true,
    });

    const payload = this.jwtService.verify<JwtPayload>(token, {
      secret,
    });

    const isRevoked = await this.redisService.isTokenRevoked(payload.jti);

    if (isRevoked) throw new Error('Token revoked');

    extra.user = payload;
  }

  extractToken(connectionParams: Record<string, string>): string | null {
    const authHeader =
      connectionParams.Authorization || connectionParams.authorization;
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

    return parts[1];
  }
}
