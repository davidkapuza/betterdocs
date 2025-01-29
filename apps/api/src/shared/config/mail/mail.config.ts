import { registerAs } from '@nestjs/config';
import { MailConfig } from './mail-config.type';
import { MailConfigSchema } from './mail-config.schema';

export const mailConfig = registerAs<MailConfig>('mail', () => {
  const config = MailConfigSchema.parse(process.env);

  return {
    host: config.MAIL_HOST,
    port: config.MAIL_PORT,
    user: config.MAIL_USER,
    password: config.MAIL_PASSWORD,
    ignoreTLS: config.MAIL_IGNORE_TLS,
    secure: config.MAIL_SECURE,
    requireTLS: config.MAIL_REQUIRE_TLS,
    defaultEmail: config.MAIL_DEFAULT_EMAIL,
    defaultName: config.MAIL_DEFAULT_NAME,
  };
});
