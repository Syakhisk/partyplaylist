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
import { Participant } from 'src/participant/entities/participant.entity';
import { ParticipantRepository } from 'src/participant/participant.repository';
import { CreatedSessionDTO } from 'src/session/dtos/createdSession.dto';
import { Session } from 'src/session/entities/session.entity';
import { ISessionService, SessionData } from 'src/session/session.interface';
import { SessionRepository } from 'src/session/session.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class SessionService implements ISessionService {
  constructor(
    @Inject(GatewaySessionManager)
    private readonly gatewayManager: GatewaySessionManager,
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(SessionRepository) private readonly sessionRepo: SessionRepository,
    @Inject(ParticipantRepository)
    private readonly participantRepo: ParticipantRepository,
  ) {}
  async addNewSession(payload: SessionData): Promise<CreatedSessionDTO> {
    await this.userRepo.checkUserExist(payload.userId);
    await this.sessionRepo.checkSessionAvaibility(payload.userId);
    const createdSessionCode = await this.sessionRepo.addNewSession(payload);
    this.gatewayManager.joinRoom(
      payload.userId,
      `session-${createdSessionCode}`,
    );
    return {
      code: createdSessionCode,
    };
  }

  @OnEvent(ServerEvent.UserOffline)
  async handleUserOffline(
    payload: ServerEventPayload[ServerEvent.UserOffline],
  ) {
    const sessionHost = await this.sessionRepo.findSessionByHost(payload.uid);
    if (!sessionHost) {
      return;
    }

    let session: Session = null;
    let candidateHost: Participant = null;
    while (!session && !candidateHost) {
      candidateHost =
        await this.participantRepo.findARandomParticipantbySessionId(
          sessionHost.id,
        );
      session = await this.participantRepo.findSessionByParticipantUid(
        candidateHost.user.uid,
      );
    }
    await this.sessionRepo.changeToANewHost(session, candidateHost.user);
    const socket = this.gatewayManager.getUserSocket(payload.uid);
    socket
      .to(`session-${sessionHost.code}`)
      .emit(WebsocketEvent.SessionHostChange, {
        newHostId: candidateHost.user.uid,
      } as WebSocketEventPayload[WebsocketEvent.SessionHostChange]);
  }
  @OnEvent(ServerEvent.PlayerPlaying)
  async handlePlayerPlaying(
    payload: ServerEventPayload[ServerEvent.PlayerPlaying],
  ) {
    await this.handlePlayerEvent(payload.uid, WebsocketEvent.PlayerPlay);
  }
  private async handlePlayerEvent(
    userId: string,
    event: 'player.play' | 'player.pause' | 'player.next' | 'player.previous',
  ) {
    const session =
      (await this.participantRepo.findSessionByParticipantUid(userId)) ??
      (await this.sessionRepo.findSessionByHost(userId));

    const socket = this.gatewayManager.getUserSocket(userId);
    socket.to(`session-${session.code}`).emit(event);
  }
}
