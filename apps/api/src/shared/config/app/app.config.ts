import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';
import { AppConfigSchema } from './app-config.schema';

export const appConfig = registerAs<AppConfig>('app', () => {
  const config = AppConfigSchema.parse(process.env);

  return {
    env: config.NODE_ENV,
    port: config.APP_PORT,
    frontendDomain: config.FRONTEND_DOMAIN,
    backendDomain: config.BACKEND_DOMAIN,
    apiPrefix: config.API_PREFIX,
  };
});
