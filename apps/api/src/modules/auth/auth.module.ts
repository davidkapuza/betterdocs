import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '@modules/users/users.module';
import { MailModule } from '@modules/mail/mail.module';
import { RedisModule } from '@modules/redis/redis.module';
import { AuthResolver } from './auth.resolver';
import { JwtAccessStrategy, JwtRefreshStrategy } from './guards';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MailModule,
    RedisModule,
    JwtModule.register({}),
  ],
  providers: [AuthService, AuthResolver, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
