import { Args, Query, Resolver } from '@nestjs/graphql';
import { GetUserArgs } from 'src/dto/user.args';
import { GetUserGrpcResponse, GetUserResponse } from 'src/models/user.model';
import { UsersApiClient } from '@adamjanin/protos/dist/adamjanin/UsersApi';
import { GrpcClient } from '@adamjanin/grpc-lib';
import { Inject } from '@nestjs/common';
import { USERS_GRPC_CLIENT } from 'src/config';
import { sqlClient } from 'src/app.module';

@Resolver(GetUserResponse)
export class UsersResolver {
  private usersApiClient: UsersApiClient;
  constructor(
    @Inject(USERS_GRPC_CLIENT)
    private readonly usersGrpcClient: GrpcClient,
  ) {
    this.usersApiClient =
      this.usersGrpcClient.getServiceClient<UsersApiClient>();
  }

  @Query(() => GetUserResponse)
  getUserGrpc(
    @Args()
    args: GetUserArgs,
  ): Promise<GetUserGrpcResponse> {
    const getUser = this.usersGrpcClient.promisify<
      typeof this.usersApiClient.getUser
    >(this.usersApiClient.getUser);
    return getUser(args);
  }

  @Query(() => GetUserResponse)
  async getUser(
    @Args()
    args: GetUserArgs,
  ): Promise<GetUserResponse> {
    const users = await sqlClient.user.findMany({
      where: {
        id: args?.id ? args?.id : undefined,
        phoneNumber: args?.phoneNumber ? args?.phoneNumber : undefined,
        email: args?.email ? args?.email : undefined,
        username: args?.username ? args?.username : undefined,
        skillsets:
          args?.skillsets?.length > 0
            ? { hasSome: args?.skillsets }
            : undefined,
      },
    });

    return {
      data: users,
      success: true,
      errors: [],
    } as GetUserResponse;
  }
}
