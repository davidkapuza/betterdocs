import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/libs/prisma';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersSeederService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('secret', salt);

    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: 'jhondow@gmail.com',
          password,
          firstName: 'John',
          lastName: 'Dow',
          status: 'active',
          role: 'admin',
        },
      });

      await tx.collection.create({
        data: {
          name: 'Initial',
          description: 'This is a seeded collection.',
          users: {
            create: { userId: user.id, role: 'owner' },
          },
        },
      });
      return user;
    });
  }
}
