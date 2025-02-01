import { authSchemas } from '@betterdocs/api-contracts';
import { UserResponseDto } from '@modules/users/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { ZSchema } from '@shared/libs/zod';

export class SignUpDto extends ZSchema(authSchemas.SignUpDtoSchema) {}
export class ConfirmEmailDto extends ZSchema(
  authSchemas.ConfirmEmailDtoSchema
) {}
export class SignInDto extends ZSchema(authSchemas.SignInDtoSchema) {}
export class SignInResponseDto extends ZSchema(
  authSchemas.SignInResponseDtoSchema
) {
  // manually describing types of nested objects to include them in openapi,
  // TODO handling of object types in libs/zod/zod.lib.ts/ getApiPropertyOptions
  @ApiProperty({ type: () => UserResponseDto })
  user!: UserResponseDto;
}
export class ResetPasswordRequestDto extends ZSchema(
  authSchemas.ResetPasswordRequestDtoSchema
) {}

export class ResetPasswordDto extends ZSchema(
  authSchemas.ResetPasswordDtoSchema
) {}
