import { usersSchemas } from '@betterdocs/api-contracts';
import { createDtoFromZod } from '@shared/libs/zod';

export class UserResponseDto extends createDtoFromZod(
  usersSchemas.UserResponseDtoSchema
) {}
