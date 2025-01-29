import { z } from 'zod';
import { Environment } from './app-config.type';

export const AppConfigSchema = z.object({
  NODE_ENV: z.nativeEnum(Environment).default(Environment.Development),
  APP_PORT: z.coerce.number().default(3000),
  FRONTEND_DOMAIN: z.string().url().default('http://localhost:4200'),
  BACKEND_DOMAIN: z.string().url().default('http://localhost:3000'),
  API_PREFIX: z.string().default('api'),
});
