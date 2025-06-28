import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/libs/prisma';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersSeederService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('secret', salt);

    // Use upsert to avoid conflicts when running the seeder multiple times
    return await this.prisma.user.upsert({
      where: {
        email: 'jhondow@gmail.com',
      },
      update: {
        // Update password in case it changed
        password,
      },
      create: {
        email: 'jhondow@gmail.com',
        password,
        firstName: 'John',
        lastName: 'Dow',
        status: 'active',
        role: 'admin',
      },
    });
  }
}
