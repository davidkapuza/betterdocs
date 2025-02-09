import { IsEmail } from 'class-validator';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class ResetPasswordRequestArgs {
  @IsEmail()
  email: string;
}
