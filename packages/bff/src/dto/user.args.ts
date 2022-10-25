import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsPhoneNumber, MaxLength, IsEmail } from 'class-validator';

@ArgsType()
export class GetUserArgs {
  @Field(() => String)
  @MaxLength(100)
  id?: string = '';

  @Field(() => String)
  @MaxLength(100)
  username?: string = '';

  @Field(() => String)
  phoneNumber?: string = '';

  @Field(() => String)
  email?: string;

  @Field(() => String)
  @MaxLength(100)
  hobby?: string = '';

  @Field(() => [String])
  skillsets?: string[] = [];

  @Field(() => String)
  createdAt?: string;

  @Field(() => String)
  updatedAt?: string;
}

@InputType()
export class PutUserArgs {
  @Field(() => String)
  @MaxLength(100)
  id?: string = '';

  @Field(() => String)
  @MaxLength(100)
  username?: string = '';

  @Field(() => String)
  @IsPhoneNumber('MY')
  phoneNumber?: string = '';

  @Field(() => String)
  @IsEmail()
  email?: string = '';

  @Field(() => String)
  @MaxLength(100)
  hobby?: string = '';

  @Field(() => [String])
  skillsets?: string[] = [];
}

@InputType()
export class DeleteUserArgs {
  @Field(() => [String])
  ids?: string[] = [];
}
