import { Catch, ExceptionFilter } from "@nestjs/common";
import {
  Client,
  ClientUnaryCall,
  credentials,
  loadPackageDefinition,
  requestCallback,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { join } from "path";
import { promisify } from "util";

export const NOT_FOUND = "NOT_FOUND";
export const FORBIDDEN = "FORBIDDEN";

interface Error {
  message: string;
}

export interface GrpcResponse<T = any> {
  data: T;
  success: boolean;
  errors: Error[];
}

export const responseFailed = (error: string): GrpcResponse<any> => {
  return {
    data: [] as any,
    success: false,
    errors: [
      {
        message: error,
      },
    ],
  };
};

export const responseSuccess: <T = any>(data?: T) => GrpcResponse<T> = (
  data = [] as any
) => {
  return {
    data,
    success: true,
    errors: [],
  };
};

interface GrpcOptions {
  package: string;
  service: string;
  fileName: string;
  url: string;
}

export class GrpcClient {
  serviceClient: Client;

  constructor(options: GrpcOptions) {
    const packageDefinition = loadSync(
      join(
        __dirname,
        `../../../node_modules/@adamjanin/protos/src/${options.fileName}`
      ),
      {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      }
    );
    const packageObject =
      loadPackageDefinition(packageDefinition)[options.package];
    this.serviceClient = new packageObject[options.service](
      options.url,
      credentials.createInsecure()
    );

    return this;
  }

  getServiceClient<T extends Client>() {
    return this.serviceClient as T;
  }

  promisify<
    T extends (argument: any, callback: requestCallback<any>) => ClientUnaryCall
  >(fn: (argument: any, callback: requestCallback<any>) => ClientUnaryCall) {
    return promisify<Parameters<T>[0], Parameters<Parameters<T>[1]>[1]>(
      fn
    ).bind(this.serviceClient);
  }
}

@Catch()
export class GenericException implements ExceptionFilter {
  public catch(err: string): any {
    console.log(err);
    return responseFailed(err);
  }
}

export * from "@grpc/grpc-js";
