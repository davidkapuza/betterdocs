import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { VoidResolver } from 'graphql-scalars';
import { join } from 'path';
import { GraphQLService } from './graphql.service';
import { Context } from 'graphql-ws';
import { JwtPayload } from '@shared/types';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule, JwtModule],
      inject: [ConfigService, JwtService],
      useFactory: (
        configService: ConfigService,
        jwtService: JwtService
      ) => {
        const graphQLService = new GraphQLService(
          configService,
          jwtService
        );

        return {
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
              path: '/subscriptions',
              onConnect: async (
                context: Context<Record<string, string>, { user: JwtPayload }>
              ) => graphQLService.handleSubscriptionConnection(context),
            },
          },
        };
      },
    }),
  ],
  providers: [GraphQLService],
  exports: [GraphQLService],
})
export class GraphQLModule {}
