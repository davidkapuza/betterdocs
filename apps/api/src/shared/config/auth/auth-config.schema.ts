import { z } from 'zod';

export const AuthConfigSchema = z.object({
  AUTH_ACCESS_JWT_SECRET: z.string(),
  AUTH_ACCESS_JWT_EXPIRATION: z.string(),
  AUTH_REFRESH_JWT_SECRET: z.string(),
  AUTH_REFRESH_JWT_EXPIRATION: z.string(),
  AUTH_RESET_PASSWORD_JWT_SECRET: z.string(),
  AUTH_RESET_PASSWORD_JWT_EXPIRATION: z.string(),
  AUTH_CONFIRM_EMAIL_JWT_SECRET: z.string(),
  AUTH_CONFIRM_EMAIL_JWT_EXPIRATION: z.string(),
});
