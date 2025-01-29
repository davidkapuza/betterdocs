import { CreateUserDtoSchema } from '../users/users.schemas';

export const SignUpDtoSchema = CreateUserDtoSchema.omit({
  role: true,
  status: true,
});
