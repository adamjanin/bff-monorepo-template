import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersResolver } from './users/users.resolver';
import { UsersMutation } from './users/users.mutation';
import { GrpcClient } from '@adamjanin/grpc-lib';
import { USERS_API_URL, USERS_GRPC_CLIENT } from './config';
import { SQLClient } from '@adamjanin/sql-client';

export const sqlClient = new SQLClient();
@Module({
  controllers: [],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      debug: false,
      plugins: [],
    }),
  ],
  providers: [
    UsersResolver,
    UsersMutation,
    {
      provide: USERS_GRPC_CLIENT,
      useValue: new GrpcClient({
        package: 'adamjanin',
        service: 'UsersApi',
        fileName: 'users.proto',
        url: USERS_API_URL,
      }),
    },
    {
      provide: 'SQLClient',
      useValue: sqlClient,
    },
  ],
})
export class AppModule {}
