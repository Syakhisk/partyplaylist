import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FirebaseAdmin } from 'src/authorization/firebase/firebase';
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
import { CreatedSessionDTO } from 'src/session/dtos/createdSession.dto';
import { SessionDetailDTO } from 'src/session/dtos/getSessionDetail.dto';
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
    @Inject(forwardRef(() => ParticipantRepository))
    private readonly participantRepo: ParticipantRepository,
    @Inject(FirebaseAdmin) private readonly firebaseAdmin: FirebaseAdmin,
  ) {}

  async addNewSession(payload: SessionData): Promise<CreatedSessionDTO> {
    await this.userRepo.checkUserExist(payload.userId);
    await this.sessionRepo.checkSessionAvaibility(payload.userId);
    await this.participantRepo.checkParticipantAvaibility(payload.userId);
    const createdSessionCode = await this.sessionRepo.addNewSession(payload);
    this.gatewayManager.joinRoom(
      payload.userId,
      `session-${createdSessionCode}`,
    );
    return {
      code: createdSessionCode,
    };
  }

  async getSessionDetail(
    requestUID: string,
    code: string,
  ): Promise<SessionDetailDTO> {
    await this.userRepo.checkUserExist(requestUID);
    await this.sessionRepo.checkSessionExistByCode(code);
    const session =
      (await this.sessionRepo.findSessionByHost(requestUID, { user: true })) ??
      (await this.participantRepo.findSessionByParticipantUid(requestUID, {
        user: true,
      }));
    if (!session)
      throw new ForbiddenException({
        message: 'not belong to a corresponding session',
      });
    if (session.code !== code)
      throw new ForbiddenException({
        message: 'trying to accessing a different session',
      });
    const host = await this.firebaseAdmin.getUserByUID(session.host.uid);
    return {
      name: session.name,
      host: {
        uid: host.uid,
        displayName: host.displayName,
        email: host.email,
        photoURL: host.photoURL,
      },
    };
  }

  async endSession(requestUID: string, code: string): Promise<void> {
    await this.userRepo.checkUserExist(requestUID);
    await this.sessionRepo.checkSessionExistByCode(code);
    const session = await this.sessionRepo.findSessionByHost(requestUID);
    if (!session) throw new ForbiddenException({ message: 'not a host' });
    if (session.code !== code)
      throw new ForbiddenException({
        message: 'trying to delete another session',
      });
    await this.sessionRepo.endSession(code);
  }

  @OnEvent(ServerEvent.UserOffline)
  async handleHostOffline(
    payload: ServerEventPayload[ServerEvent.UserOffline],
  ) {
    const sessionHost = await this.sessionRepo.findSessionByHost(payload.uid);
    if (!sessionHost) return;

    const candidateHost =
      await this.participantRepo.findARandomParticipantbySessionId(
        sessionHost.id,
      );

    if (!candidateHost || !candidateHost.user) {
      await this.sessionRepo.endSession(sessionHost.code);
      return;
    }
    await this.sessionRepo.changeToANewHost(sessionHost, candidateHost.user);
    const socket = this.gatewayManager.getUserSocket(payload.uid);
    if (!socket) return;
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
    if (!session) return;

    const socket = this.gatewayManager.getUserSocket(userId);
    if (!socket) return;
    socket.to(`session-${session.code}`).emit(event);
  }
}
