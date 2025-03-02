import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from '@modules/auth/auth.module';
import { DocumentsModule } from '@modules/documents/documents.module';
import { RedisModule } from '@modules/redis/redis.module';
import { RedisService } from '@modules/redis/redis.service';
import { UsersModule } from '@modules/users/users.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { appConfig } from '@shared/config/app';
import { authConfig } from '@shared/config/auth';
import { mailConfig } from '@shared/config/mail';
import { rabbitMQConfig } from '@shared/config/rabbitmq';
import { redisConfig } from '@shared/config/redis';
import { JwtPayload } from '@shared/types';
import { VoidResolver } from 'graphql-scalars';
import { Context } from 'graphql-ws';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, mailConfig, redisConfig, rabbitMQConfig],
      envFilePath: ['.env'],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,

      imports: [ConfigModule, RedisModule, JwtModule], // Import JwtModule if needed
      inject: [ConfigService, RedisService, JwtService],
      useFactory: (
        configService: ConfigService,
        redisService: RedisService,
        jwtService: JwtService
      ) => ({
        autoSchemaFile: join(process.cwd(), 'graphql/schema.gql'),
        playground: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        plugins: [ApolloServerPluginLandingPageLocalDefault() as any],
        resolvers: {
          Void: VoidResolver,
        },
        autoTransformHttpErrors: true,
        subscriptions: {
          'graphql-ws': {
            onConnect: async (
              context: Context<Record<string, string>, { user: JwtPayload }>
            ) => {
              const { connectionParams, extra } = context;

              const token = (
                connectionParams.Authorization || connectionParams.authorization
              )?.split(' ')[1];

              if (!token) throw new Error('Missing token');

              const secret = configService.get('auth.accessTokenSecret', {
                infer: true,
              });
              const payload = jwtService.verify<JwtPayload>(token, {
                secret,
              });
              const isRevoked = await redisService.isTokenRevoked(payload.jti);

              if (isRevoked) throw new Error('Token revoked');

              extra.user = payload;
            },
          },
        },
      }),
    }),
    AuthModule,
    UsersModule,
    DocumentsModule,
  ],
})
export class AppModule {}
