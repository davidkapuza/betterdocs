export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export type AppConfig = {
  env: Environment;
  port: number;
  frontendDomain: string;
  backendDomain: string;
  apiPrefix: string;
};
