export interface JwtPayload {
  userId: number;
  sub: string;
  exp: number;
  jti: string;
  iat: number;
}
