import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewayModule } from 'src/gateway/gateway.module';
import { GatewaySessionManager } from 'src/gateway/gateway.session';
import { Participant } from 'src/participant/entities/participant.entity';
import { ParticipantRepository } from 'src/participant/participant.repository';
import { ParticipantService } from 'src/participant/participant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Participant]), GatewayModule],
  providers: [ParticipantRepository, GatewaySessionManager, ParticipantService],
})
export class ParticipantModule {}
