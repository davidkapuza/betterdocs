import { authSchemas } from '@betterdocs/api-contracts';
import { ZSchema } from '@shared/libs/zod';

export class SignUpDto extends ZSchema(authSchemas.SignUpDtoSchema) {}
