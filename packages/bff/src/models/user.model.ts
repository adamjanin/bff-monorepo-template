import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  phoneNumber: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  hobby: string;

  @Field(() => [String], { nullable: true })
  skillsets: Array<string>;
}

@ObjectType()
export class UserOutput extends User {
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}

@ObjectType()
export class UserGrpc extends User {
  @Field(() => Date, { nullable: true })
  createdAt: string;

  @Field(() => Date, { nullable: true })
  updatedAt: string;
}

@ObjectType()
export class GetUserResponse {
  @Field(() => [UserOutput], { nullable: true })
  data: UserOutput[] = [];

  @Field({ nullable: true })
  success: boolean;

  @Field(() => [ErrorResponse], { nullable: true })
  errors: ErrorResponse[];
}

@ObjectType()
export class GetUserGrpcResponse {
  @Field(() => [UserGrpc], { nullable: true })
  data: UserGrpc[] = [];

  @Field({ nullable: true })
  success: boolean;

  @Field(() => [ErrorResponse], { nullable: true })
  errors: ErrorResponse[];
}

@ObjectType()
export class SuccessResponse {
  @Field()
  success: boolean;

  @Field()
  data: string;

  @Field(() => [ErrorResponse], { nullable: true })
  errors: ErrorResponse[];
}

@ObjectType()
export class ErrorResponse {
  @Field()
  message: string;
}
