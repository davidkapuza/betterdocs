export type AuthConfig = {
  jwtSecret: string;
  jwtExpirationTime: string;
  jwtRefreshSecret: string;
  jwtRefreshExpirationTime: string;
  forgotSecret: string;
  forgotExpirationTime: string;
  confirmEmailSecret: string;
  confirmEmailExpirationTime: string;
};
