import { usersSchemas } from '@betterdocs/api-contracts';
import { ZSchema } from '@shared/libs/zod';

export class UserResponseDto extends ZSchema(
  usersSchemas.UserResponseDtoSchema
) {}
