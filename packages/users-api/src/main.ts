// This must be at the top
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
  path: `${__dirname}/../.env`,
  debug: true,
});

import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { GenericException } from '@adamjanin/grpc-lib';

async function bootstrap() {
  const PORT = parseInt(process.env.PORT, 10) || 50001;
  const url = `0.0.0.0:${PORT}`;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'adamjanin',
        protoPath: join(
          __dirname,
          '../../../node_modules/@adamjanin/protos/src/users.proto',
        ),
        url,
      },
    },
  );
  app.useGlobalFilters(new GenericException());
  await app.listen();
  console.log(`Application is running on: ${url}`);
}
bootstrap();
