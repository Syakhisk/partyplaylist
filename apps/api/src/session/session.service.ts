import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
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
import { ParticipantsDTO } from 'src/session/dtos/getParticipants.dto';
import { SessionDetailDTO } from 'src/session/dtos/getSessionDetail.dto';
import {
  ISessionService,
  LeaveSession,
  SessionData,
} from 'src/session/session.interface';
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

  async kickByHostOrLeaveSession(payload: LeaveSession): Promise<void> {
    await this.userRepo.checkUserExist(payload.userId);
    await this.sessionRepo.checkSessionExistByCode(payload.code);
    await this.participantRepo.checkParticipantExistsBySessionCode(
      payload.userId,
      payload.code,
    );
    const session = await this.sessionRepo.findSessionByHost(
      payload.requestUID,
    );

    if (!session && payload.requestUID !== payload.userId)
      throw new HttpException(
        { message: 'participant cant kick another participant' },
        HttpStatus.FORBIDDEN,
      );
    if (!session) {
      await this.participantRepo.removeParticipantByUserId(payload.userId);
      return;
    }
    if (payload.code !== session.code)
      throw new HttpException(
        { message: 'host belong to another session' },
        HttpStatus.FORBIDDEN,
      );
    //payload.requestUID === payload.userId will never happened, cos host cant be a participant
    await this.participantRepo.removeParticipantByUserId(payload.userId);
  }

  async joinASession(userId: string, sessionCode: string): Promise<void> {
    await this.userRepo.checkUserExist(userId);
    const sessionId = await this.sessionRepo.checkSessionExistByCode(
      sessionCode,
    );
    await this.sessionRepo.checkSessionAvaibility(userId);
    await this.participantRepo.checkParticipantAvaibility(userId);
    await this.participantRepo.joinSession(userId, sessionId);
    const socket = this.gatewayManager.getUserSocket(userId);
    if (!socket) return;
    socket.to(`session-${sessionCode}`).emit(WebsocketEvent.ParticipantJoin, {
      userId,
    } as WebSocketEventPayload[WebsocketEvent.ParticipantJoin]);
    this.gatewayManager.joinRoom(userId, `session-${sessionCode}`);
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

  async getParticipantsBySessionCode(
    requestUID: string,
    code: string,
  ): Promise<ParticipantsDTO> {
    await this.userRepo.checkUserExist(requestUID);
    await this.sessionRepo.checkSessionExistByCode(code);
    const session =
      (await this.sessionRepo.findSessionByHost(requestUID)) ??
      (await this.participantRepo.findSessionByParticipantUid(requestUID));
    if (!session)
      throw new ForbiddenException({
        message: 'not belong to a corresponding session',
      });
    if (session.code !== code)
      throw new ForbiddenException({
        message: 'trying to accessing a different session',
      });
    const { userIds } = await this.participantRepo.findParticipantsBySessionId(
      session.id,
    );
    const { users } = await this.firebaseAdmin.getUsersByUID(userIds);
    return {
      participants: users.map((user) => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      })),
    };
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

    const socket = this.gatewayManager.getUserSocket(userId);
    if (!socket) return;
    socket.to(`session-${session.code}`).emit(event);
  }
}
