import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { WebsocketAdapter } from 'src/gateway/gateway.adapter';
import { AppConfig } from 'src/config/app.config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  app.enableCors();
  app.useWebSocketAdapter(new WebsocketAdapter(app));
  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });
  const config = new DocumentBuilder()
    .setTitle('PartyPlaylist API')
    .addBearerAuth()
    .setDescription('lets make offline partyPlaylist on the fly!')
    .setVersion('1.0')
    .build();
  patchNestjsSwagger();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const appConfig = app.get(ConfigService).get<AppConfig>('app');
  await app.listen(appConfig.port);

  console.log(`listening on PORT ${appConfig.host}:${appConfig.port}`);
}
bootstrap();
