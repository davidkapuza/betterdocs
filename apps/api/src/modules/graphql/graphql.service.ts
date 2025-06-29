import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Context } from 'graphql-ws';
import { JwtPayload } from '@shared/types';

@Injectable()
export class GraphQLService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
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

    // No token revocation check - relying on JWT expiration only
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
