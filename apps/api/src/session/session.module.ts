import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from 'src/authorization/authorization.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { Participant } from 'src/participant/entities/participant.entity';
import { ParticipantModule } from 'src/participant/participant.module';
import { ParticipantRepository } from 'src/participant/participant.repository';
import { Session } from 'src/session/entities/session.entity';
import { SessionController } from 'src/session/session.controller';
import { SessionRepository } from 'src/session/session.repository';
import { SessionService } from 'src/session/session.service';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, User, Participant]),
    UserModule,
    GatewayModule,
    forwardRef(() => ParticipantModule),
    AuthorizationModule,
  ],
  providers: [SessionRepository, SessionService, ParticipantRepository],
  controllers: [SessionController],
  exports: [SessionRepository],
})
export class SessionModule {}
