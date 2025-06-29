import { AuthModule } from '@modules/auth/auth.module';
import { CollectionsModule } from '@modules/collections/collections.module';
import { DocumentsModule } from '@modules/documents/documents.module';
import { GraphQLModule } from '@modules/graphql/graphql.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@shared/config/app';
import { authConfig } from '@shared/config/auth';
import { mailConfig } from '@shared/config/mail';
import { rabbitMQConfig } from '@shared/config/rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, mailConfig, rabbitMQConfig],
      envFilePath: ['.env'],
    }),
    GraphQLModule,
    AuthModule,
    UsersModule,
    DocumentsModule,
    CollectionsModule,
  ],
})
export class AppModule {}
