import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig, { AppConfig } from 'src/config/app.config';
import databaseConfig, { DatabaseConfig } from 'src/config/database.config';
import { AuthorizationModule } from 'src/authorization/authorization.module';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { ResourceModule } from './resource/resource.module';
import { Session } from 'src/session/entities/session.entity';
import { Participant } from 'src/participant/entities/participant.entity';
import { Song } from 'src/song/entities/song.entity';
import { SessionModule } from 'src/session/session.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from '@anatine/zod-nestjs';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const db = config.get<DatabaseConfig>('database');
        const app = config.get<AppConfig>('app');
        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.user,
          password: db.password,
          database: db.dbName,
          synchronize: app.env === 'dev' ? true : false,
          entities: [User, Session, Participant, Song],
        };
      },
      inject: [ConfigService],
    }),
    AuthorizationModule,
    UserModule,
    ResourceModule,
    SessionModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
