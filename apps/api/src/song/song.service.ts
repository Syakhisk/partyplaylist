import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ServerEvent,
  ServerEventPayload,
} from 'src/common/constant/serverEvent.constant';
import {
  WebSocketEventPayload,
  WebsocketEvent,
} from 'src/common/constant/websocket.constant';
import { GatewaySessionManager } from 'src/gateway/gateway.session';
import { SongRepository } from 'src/song/song.repository';

@Injectable()
export class SongService {
  constructor(
    @Inject(GatewaySessionManager)
    private readonly gatewayManager: GatewaySessionManager,
    @Inject(SongRepository)
    private readonly songRepo: SongRepository,
  ) {}

  // @OnEvent(ServerEvent.UserOffline)
  // async handleSongOffline(
  //   payload: ServerEventPayload[ServerEvent.UserOffline],
  // ) {
  //   const socket = this.gatewayManager.getUserSocket(payload.uid);
  //   const session = await this.songRepo.findSessionBySongUid(
  //     payload.uid,
  //   );

  //   socket.to(`session-${session.code}`).emit(WebsocketEvent.SongLeave, {
  //     userId: socket.userId,
  //   } as WebSocketEventPayload[WebsocketEvent.SongLeave]);

  //   await this.songRepo.removeSongByUserId(payload.uid);
  // }
}
