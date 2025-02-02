import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@shared/config/app';
import { authConfig } from '@shared/config/auth';
import { mailConfig } from '@shared/config/mail';
import { redisConfig } from '@shared/config/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, mailConfig, redisConfig],
      envFilePath: ['.env'],
    }),
    AuthModule,
  ],
})
export class AppModule {}
