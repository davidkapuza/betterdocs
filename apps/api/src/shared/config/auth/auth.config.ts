import { registerAs } from '@nestjs/config';
import { AuthConfig } from './auth-config.type';
import { AuthConfigSchema } from './auth-config.schema';

export const authConfig = registerAs<AuthConfig>('auth', () => {
  const config = AuthConfigSchema.parse(process.env);

  return {
    accessTokenSecret: config.AUTH_JWT_SECRET,
    accessTokenExpiration: config.AUTH_JWT_TOKEN_EXPIRES_IN,
    refreshTokenSecret: config.AUTH_REFRESH_SECRET,
    refreshTokenExpiration: config.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    forgotTokenSecret: config.AUTH_FORGOT_SECRET,
    forgotTokenExpiration: config.AUTH_FORGOT_TOKEN_EXPIRES_IN,
    confirmEmailSecret: config.AUTH_CONFIRM_EMAIL_SECRET,
    confirmEmailExpiration: config.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
  };
});
