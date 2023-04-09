import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewayModule } from 'src/gateway/gateway.module';
import { GatewaySessionManager } from 'src/gateway/gateway.session';
import { Song } from 'src/song/entities/song.entity';
import { SongRepository } from 'src/song/song.repository';
import { SongService } from 'src/song/song.service';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { SongController } from './song.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Song, User]), UserModule, GatewayModule],
  providers: [SongRepository, GatewaySessionManager, SongService],
  controllers: [SongController],
})
export class SongModule {}
