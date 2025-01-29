import { registerAs } from '@nestjs/config';
import { AuthConfig } from './auth-config.type';
import { AuthConfigSchema } from './auth-config.schema';

export const authConfig = registerAs<AuthConfig>('auth', () => {
  const config = AuthConfigSchema.parse(process.env);

  return {
    jwtSecret: config.AUTH_JWT_SECRET,
    jwtExpirationTime: config.AUTH_JWT_TOKEN_EXPIRES_IN,
    jwtRefreshSecret: config.AUTH_REFRESH_SECRET,
    jwtRefreshExpirationTime: config.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    forgotSecret: config.AUTH_FORGOT_SECRET,
    forgotExpirationTime: config.AUTH_FORGOT_TOKEN_EXPIRES_IN,
    confirmEmailSecret: config.AUTH_CONFIRM_EMAIL_SECRET,
    confirmEmailExpirationTime: config.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
  };
});
