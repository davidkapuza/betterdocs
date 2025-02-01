import { registerAs } from '@nestjs/config';
import { AuthConfig } from './auth-config.type';
import { AuthConfigSchema } from './auth-config.schema';
import { StringValue } from 'ms';

export const authConfig = registerAs<AuthConfig>('auth', () => {
  const config = AuthConfigSchema.parse(process.env);

  return {
    accessTokenSecret: config.AUTH_ACCESS_JWT_SECRET,
    accessTokenExpiration: config.AUTH_ACCESS_JWT_EXPIRATION as StringValue,
    refreshTokenSecret: config.AUTH_REFRESH_JWT_SECRET,
    refreshTokenExpiration: config.AUTH_REFRESH_JWT_EXPIRATION as StringValue,
    resetPasswordTokenSecret: config.AUTH_RESET_PASSWORD_JWT_SECRET,
    resetPasswordTokenExpiration: config.AUTH_RESET_PASSWORD_JWT_EXPIRATION as StringValue,
    confirmEmailSecret: config.AUTH_CONFIRM_EMAIL_JWT_SECRET,
    confirmEmailExpiration:
      config.AUTH_CONFIRM_EMAIL_JWT_EXPIRATION as StringValue,
  };
});
