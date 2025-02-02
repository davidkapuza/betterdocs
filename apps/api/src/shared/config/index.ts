import { AppConfig } from './app';
import { AuthConfig } from './auth';
import { MailConfig } from './mail';
import { RedisConfig } from './redis';

export type Config = {
  app: AppConfig;
  auth: AuthConfig;
  mail: MailConfig;
  redis: RedisConfig;
};
