import { InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
  firstName: string;
  lastName: string;
}

@InputType()
export class SignInInput {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}

@InputType()
export class ResetPasswordInput {
  @MinLength(6)
  password: string;

  hash: string;
}
