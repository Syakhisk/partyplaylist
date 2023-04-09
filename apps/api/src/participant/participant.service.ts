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
import { ParticipantRepository } from 'src/participant/participant.repository';

@Injectable()
export class ParticipantService {
  constructor(
    @Inject(GatewaySessionManager)
    private readonly gatewayManager: GatewaySessionManager,
    @Inject(ParticipantRepository)
    private readonly participantRepo: ParticipantRepository,
  ) {}

  @OnEvent(ServerEvent.UserOffline)
  async handleParticipantOffline(
    payload: ServerEventPayload[ServerEvent.UserOffline],
  ) {
    const session = await this.participantRepo.findSessionByParticipantUid(
      payload.uid,
    );
    if (!session) return;
    await this.participantRepo.removeParticipantByUserId(payload.uid);

    const socket = this.gatewayManager.getUserSocket(payload.uid);
    if (!socket) return;
    socket.to(`session-${session.code}`).emit(WebsocketEvent.ParticipantLeave, {
      userId: socket.userId,
    } as WebSocketEventPayload[WebsocketEvent.ParticipantLeave]);
  }
}
