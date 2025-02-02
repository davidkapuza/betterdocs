import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@modules/users/users.module';
import { MailModule } from '@modules/mail/mail.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RedisModule } from '@modules/redis/redis.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MailModule,
    RedisModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
