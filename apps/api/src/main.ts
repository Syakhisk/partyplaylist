// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ZodValidationPipe, patchNestjsSwagger } from '@anatine/zod-nestjs';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableShutdownHooks();
  app.useGlobalPipes(new ZodValidationPipe());
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });
  const config = new DocumentBuilder()
    .setTitle('PartyPlaylist API')
    .setDescription('lets make offline partyPlaylist ont he fly!')
    .setVersion('1.0')
    .addTag('users')
    .build();
  patchNestjsSwagger();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
