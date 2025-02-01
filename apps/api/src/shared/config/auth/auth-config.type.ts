import { StringValue } from 'ms';

export type AuthConfig = {
  accessTokenSecret: string;
  accessTokenExpiration: StringValue;
  refreshTokenSecret: string;
  refreshTokenExpiration: StringValue;
  resetPasswordTokenSecret: string;
  resetPasswordTokenExpiration: StringValue;
  confirmEmailSecret: string;
  confirmEmailExpiration: StringValue;
};
