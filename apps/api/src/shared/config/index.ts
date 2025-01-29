import { AppConfig } from './app';
import { AuthConfig } from './auth';
import { MailConfig } from './mail';

export type Config = {
  app: AppConfig;
  auth: AuthConfig;
  mail: MailConfig;
};
