import { z } from 'zod';
import { Role, Status } from '@prisma/client';

export const UserResponseDtoSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.nativeEnum(Role).default(Role.user),
  status: z.nativeEnum(Status).default(Status.inactive),
});

export const CreateUserDtoSchema = z.object({
  email: z.string().toLowerCase().email().meta({
    example: 'example@gmail.com',
  }),
  password: z.string().min(6).meta({
    example: '12345678',
  }),
  firstName: z.string().meta({
    example: 'Jhon',
  }),
  lastName: z.string().meta({
    example: 'Dow',
  }),
  role: z.nativeEnum(Role).default(Role.user),
  status: z.nativeEnum(Status).default(Status.inactive),
});
