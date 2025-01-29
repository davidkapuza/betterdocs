import { z } from 'zod';

export const MailConfigSchema = z.object({
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number().min(0).max(65535),
  MAIL_USER: z.string(),
  MAIL_PASSWORD: z.string(),
  MAIL_IGNORE_TLS: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true'),
  MAIL_SECURE: z.enum(['true', 'false']).transform((value) => value === 'true'),
  MAIL_REQUIRE_TLS: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true'),
  MAIL_DEFAULT_EMAIL: z.string().email(),
  MAIL_DEFAULT_NAME: z.string(),
});
