import { createDtoFromZod } from '@shared/libs/zod';
import { authSchemas } from '@betterdocs/api-contracts';

export class SignUpDto extends createDtoFromZod(authSchemas.SignUpDtoSchema) {}