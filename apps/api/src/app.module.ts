import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/users.module';
import { FileModule } from 'src/files/file.module';
import { SecurityModule } from 'src/security/security.module';
import { User } from 'src/users/entities/user.entity';
import { FileEntity } from 'src/files/entities/files.entity';

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
      entities: [User, FileEntity],
    }),
    SecurityModule,
    FileModule,
    UserModule,
  ],
})
export class AppModule {}
