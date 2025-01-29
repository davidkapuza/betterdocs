import { UsersService } from '@modules/users/users.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos';
import { PrismaService } from '@shared/libs/prisma';
import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Config } from '@shared/config';
import { MailService } from '@modules/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService<Config>
  ) {}

  async signup(signUpDto: SignUpDto): Promise<void> {
    const exists = await this.prisma.user.findUnique({
      where: {
        email: signUpDto.email,
      },
    });

    if (exists) {
      throw new ConflictException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(signUpDto.password, salt);

    const createUserDto = {
      ...signUpDto,
      password,
    };

    const createdUser = await this.usersService.create(createUserDto);

    const hash = await this.jwtService.signAsync(
      {
        userId: createdUser.id,
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
      to: createUserDto.email,
      data: {
        hash,
      },
    });
  }
}
