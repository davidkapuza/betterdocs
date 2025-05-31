import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@shared/config/app';
import { UsersSeederModule } from './user/users-seeder.module';
import { DocumentsSeederModule } from './document/documents-seeder.module';

@Module({
  imports: [
    UsersSeederModule,
    DocumentsSeederModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
  ],
})
export class SeedersModule {}
