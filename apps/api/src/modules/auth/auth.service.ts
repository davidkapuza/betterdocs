import { UsersService } from '@modules/users/users.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/signup.dto';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Config } from '@shared/config';
import { MailService } from '@modules/mail/mail.service';
import { Status } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<Config>
  ) {}

  async signup(signUpDto: SignUpDto): Promise<void> {
    let user = await this.usersService.findByEmail(signUpDto.email);

    if (user && user.status === Status.active) {
      throw new ConflictException('User already exists');
    }

    if (!user) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(signUpDto.password, salt);

      const createUserDto = {
        ...signUpDto,
        password,
      };

      user = await this.usersService.create(createUserDto);
    }

    const hash = await this.jwtService.signAsync(
      {
        userId: user.id,
      },
      {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow(
          'auth.confirmEmailExpirationTime',
          {
            infer: true,
          }
        ),
      }
    );

    await this.mailService.sendSignUpConfirmation({
      to: user.email,
      data: {
        hash,
      },
    });
  }
}
