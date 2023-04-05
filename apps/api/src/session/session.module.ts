import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from 'src/session/entities/session.entity';
import { SessionController } from 'src/session/session.controller';
import { SessionRepository } from 'src/session/session.repository';
import { SessionService } from 'src/session/session.service';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Session, User]), UserModule],
  providers: [UserRepository, SessionRepository, SessionService],
  controllers: [SessionController],
})
export class SessionModule {}
