import { SQLClient } from '@adamjanin/sql-client';
import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';

@Module({
  controllers: [UsersController],
  providers: [SQLClient],
})
export class AppModule {}
