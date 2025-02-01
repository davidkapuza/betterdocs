import { Session, User } from '@prisma/client';

export type JwtAccessPayloadType = {
  userId: User['id'];
  role: User['role'];
  sessionId: Session['id'];
};

export type JwtRefreshPayloadType = {
  sessionId: Session['id'];
  hash: Session['hash'];
};
