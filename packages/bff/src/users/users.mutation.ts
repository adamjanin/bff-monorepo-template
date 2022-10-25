import { Inject, Injectable, ValidationPipe } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { DeleteUserArgs, PutUserArgs } from 'src/dto/user.args';
import {
  GetUserGrpcResponse,
  GetUserResponse,
  SuccessResponse,
} from 'src/models/user.model';
import { UsersApiClient } from '@adamjanin/protos/dist/adamjanin/UsersApi';
import { USERS_GRPC_CLIENT } from 'src/config';
import { GrpcClient } from '@adamjanin/grpc-lib';
import { sqlClient } from 'src/app.module';
import { ObjectID } from 'bson';
import { createAt, updateAt } from '@adamjanin/sql-client';
@Injectable()
export class UsersMutation {
  private usersApiClient: UsersApiClient;
  constructor(
    @Inject(USERS_GRPC_CLIENT)
    private readonly usersGrpcClient: GrpcClient,
  ) {
    this.usersApiClient =
      this.usersGrpcClient.getServiceClient<UsersApiClient>();
  }

  @Mutation(() => GetUserResponse)
  async putUserGrpc(
    @Args('putUserArgs', new ValidationPipe())
    args: PutUserArgs,
  ): Promise<GetUserGrpcResponse> {
    const putUser = this.usersGrpcClient.promisify<
      typeof this.usersApiClient.putUser
    >(this.usersApiClient.putUser);
    return putUser(args);
  }

  @Mutation(() => SuccessResponse)
  async deleteUserGrpc(
    @Args('deleteUserArgs', new ValidationPipe())
    args: DeleteUserArgs,
  ): Promise<SuccessResponse> {
    const deleteUser = this.usersGrpcClient.promisify<
      typeof this.usersApiClient.deleteUser
    >(this.usersApiClient.deleteUser);
    return deleteUser(args);
  }

  @Mutation(() => GetUserResponse)
  async putUser(
    @Args('putUserArgs', new ValidationPipe())
    args: PutUserArgs,
  ): Promise<GetUserResponse> {
    const ObjectId = args?.id ? args?.id : new ObjectID().toString();
    delete args.id;
    try {
      const resp = await sqlClient.user.upsert({
        where: { id: ObjectId },
        update: { ...args, ...updateAt(new Date()) },
        create: { ...args, ...createAt(new Date()) },
      });
      return { data: [resp], errors: [], success: true };
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => SuccessResponse)
  async deleteUser(
    @Args('deleteUserArgs', new ValidationPipe())
    args: DeleteUserArgs,
  ): Promise<SuccessResponse> {
    try {
      const resp = await sqlClient.user.deleteMany({
        where: { id: { in: args.ids } },
      });
      return {
        data: `${resp.count} users deleted`,
        errors: [],
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }
}
