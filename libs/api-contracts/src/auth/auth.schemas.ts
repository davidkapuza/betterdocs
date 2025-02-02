import { z } from 'zod';
import {
  CreateUserDtoSchema,
  UserResponseDtoSchema,
} from '../users/users.schemas';

export const SignUpDtoSchema = CreateUserDtoSchema.omit({
  role: true,
  status: true,
});

export const ConfirmEmailDtoSchema = z.object({
  hash: z.string(),
});

export const SignInDtoSchema = SignUpDtoSchema.pick({
  email: true,
  password: true,
});

export const JwtTokensResponseDtoSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const SignInResponseDtoSchema = JwtTokensResponseDtoSchema.extend({
  user: UserResponseDtoSchema,
});

export const ResetPasswordRequestDtoSchema = SignUpDtoSchema.pick({
  email: true,
});

export const ResetPasswordDtoSchema = SignInDtoSchema.pick({
  password: true,
}).extend({
  hash: z.string(),
});
