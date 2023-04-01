import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/files/entities/files.entity';
import { FileModule } from 'src/files/file.module';
import { FileRepository } from 'src/files/file.repository';
import { BcryptPasswordHash } from 'src/security/bcrypt/bcryptSecurity.service';
import { SecurityModule } from 'src/security/security.module';
import { User } from 'src/users/entities/user.entity';
import { UserController } from 'src/users/user.controller';
import { UserRepository } from 'src/users/user.repository';
import { UserService } from 'src/users/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, FileEntity]),
    FileModule,
    SecurityModule,
  ],
  providers: [UserRepository, FileRepository, UserService, BcryptPasswordHash],
  controllers: [UserController],
})
export class UserModule {}
