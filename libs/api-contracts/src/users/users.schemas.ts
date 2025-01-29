import { z } from 'zod';
import { Role, Status } from '@prisma/client';

export const UserResponseDtoSchema = z.object({
  id: z.number(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.nativeEnum(Role).default(Role.user),
  status: z.nativeEnum(Status).default(Status.inactive),
});

export const CreateUserDtoSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  role: z.nativeEnum(Role).default(Role.user),
  status: z.nativeEnum(Status).default(Status.inactive),
});
