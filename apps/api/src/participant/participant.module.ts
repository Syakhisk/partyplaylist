import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from 'src/authorization/authorization.module';
import { GatewayModule } from 'src/gateway/gateway.module';
import { Participant } from 'src/participant/entities/participant.entity';
import { ParticipantController } from 'src/participant/participant.controller';
import { ParticipantRepository } from 'src/participant/participant.repository';
import { ParticipantService } from 'src/participant/participant.service';
import { Session } from 'src/session/entities/session.entity';
import { SessionModule } from 'src/session/session.module';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participant, Session, User]),
    GatewayModule,
    AuthorizationModule,
    UserModule,
    forwardRef(() => SessionModule),
  ],
  providers: [ParticipantRepository, ParticipantService],
  controllers: [ParticipantController],
  exports: [ParticipantRepository],
})
export class ParticipantModule {}
