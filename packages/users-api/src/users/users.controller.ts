import { createAt, SQLClient, updateAt } from '@adamjanin/sql-client';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { User } from '@adamjanin/protos/dist/adamjanin/User';
import { UserResponse__Output } from '@adamjanin/protos/dist/adamjanin/UserResponse';
import { DeleteUserRequest } from '@adamjanin/protos/dist/adamjanin/DeleteUserRequest';
import { DeleteUserResponse__Output } from '@adamjanin/protos/dist/adamjanin/DeleteUserResponse';
import { responseSuccess } from '@adamjanin/grpc-lib';
import { ObjectID } from 'bson';
@Controller()
export class UsersController {
  constructor(private sqlClient: SQLClient) {}

  @GrpcMethod('UsersApi', 'getUser')
  async getUser(args: User): Promise<UserResponse__Output> {
    const users = await this.sqlClient.user.findMany({
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

    return responseSuccess(
      users.map((user) => {
        return {
          ...user,
          createdAt: user.createdAt?.toUTCString(),
          updatedAt: user.updatedAt?.toUTCString(),
        };
      }),
    );
  }

  @GrpcMethod('UsersApi', 'deleteUser')
  async deleteUser(
    args: DeleteUserRequest,
  ): Promise<DeleteUserResponse__Output> {
    try {
      const resp = await this.sqlClient.user.deleteMany({
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

  @GrpcMethod('UsersApi', 'putUser')
  async putUser(args: User): Promise<UserResponse__Output> {
    const ObjectId = args?.id ? args?.id : new ObjectID().toString();
    delete args.id;
    try {
      const resp = await this.sqlClient.user.upsert({
        where: { id: ObjectId },
        update: { ...args, ...updateAt(new Date()) },
        create: { ...args, ...createAt(new Date()) },
      });
      return {
        data: [
          {
            ...resp,
            createdAt: resp.createdAt?.toUTCString(),
            updatedAt: resp.updatedAt?.toUTCString(),
          },
        ],
        errors: [],
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }
}
