import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from 'src/authorization/authorization.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      username: process.env.PG_USER,
      password: String(process.env.PG_PASSWORD),
      ssl: false,
      database: process.env.PG_DB,
      synchronize: process.env.ENV === 'dev' ? true : false,
      entities: [],
    }),
    AuthorizationModule,
  ],
})
export class AppModule {}
