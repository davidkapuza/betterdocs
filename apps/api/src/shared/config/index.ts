import { AppConfig } from './app';
import { AuthConfig } from './auth';
import { MailConfig } from './mail';
import { RabbitMQConfig } from './rabbitmq';

export type Config = {
  app: AppConfig;
  auth: AuthConfig;
  mail: MailConfig;
  rmq: RabbitMQConfig
};
