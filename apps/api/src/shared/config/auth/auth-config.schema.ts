import { z } from 'zod';

export const AuthConfigSchema = z.object({
  AUTH_JWT_SECRET: z.string(),
  AUTH_JWT_TOKEN_EXPIRES_IN: z.string(),
  AUTH_REFRESH_SECRET: z.string(),
  AUTH_REFRESH_TOKEN_EXPIRES_IN: z.string(),
  AUTH_FORGOT_SECRET: z.string(),
  AUTH_FORGOT_TOKEN_EXPIRES_IN: z.string(),
  AUTH_CONFIRM_EMAIL_SECRET: z.string(),
  AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN: z.string(),
});
