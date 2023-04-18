import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewayModule } from 'src/gateway/gateway.module';
import { Song } from 'src/song/entities/song.entity';
import { SongRepository } from 'src/song/song.repository';
import { SongService } from 'src/song/song.service';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { SongController } from './song.controller';
import { SessionModule } from 'src/session/session.module';
import { ParticipantModule } from 'src/participant/participant.module';
import { Session } from 'src/session/entities/session.entity';
import { Participant } from 'src/participant/entities/participant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song, User, Session, Participant]),
    UserModule,
    GatewayModule,
    SessionModule,
    ParticipantModule,
  ],
  providers: [SongRepository, SongService],
  controllers: [SongController],
})
export class SongModule {}
