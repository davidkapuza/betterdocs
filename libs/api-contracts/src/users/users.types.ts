import { z } from 'zod';
import { CreateUserDtoSchema, UserResponseDtoSchema } from './users.schemas';

export type UserResponseDto = z.infer<typeof UserResponseDtoSchema>;
export type CreateUserOutputDto = z.infer<typeof CreateUserDtoSchema>;
export type CreateUserInputDto = z.input<typeof CreateUserDtoSchema>;
