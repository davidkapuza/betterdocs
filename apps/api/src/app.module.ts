import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from '@modules/auth/auth.module';
import { DocumentsModule } from '@modules/documents/documents.module';
import { UsersModule } from '@modules/users/users.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { appConfig } from '@shared/config/app';
import { authConfig } from '@shared/config/auth';
import { mailConfig } from '@shared/config/mail';
import { redisConfig } from '@shared/config/redis';
import { VoidResolver } from 'graphql-scalars';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, mailConfig, redisConfig],
      envFilePath: ['.env'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
      playground: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plugins: [ApolloServerPluginLandingPageLocalDefault() as any],
      resolvers: {
        Void: VoidResolver,
      },
      autoTransformHttpErrors: true,
      context: (context) => context,
      subscriptions: {
        'subscriptions-transport-ws': true,
        'graphql-ws': true,
      },
    }),
    AuthModule,
    UsersModule,
    DocumentsModule,
  ],
})
export class AppModule {}
