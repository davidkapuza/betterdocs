import { z } from 'zod';
import { CreateUserDtoSchema, UserResponseDtoSchema } from '../users/users.schemas';

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

export const SignInResponseDtoSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserResponseDtoSchema,
});
