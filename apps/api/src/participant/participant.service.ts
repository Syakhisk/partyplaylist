import {
  ForbiddenException,
  HttpException,
  HttpStatus,
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
import {
  IParticipantService,
  LeaveSession,
} from 'src/participant/participant.interface';
import { ParticipantRepository } from 'src/participant/participant.repository';
import { ParticipantsDTO } from 'src/participant/dtos/getParticipants.dto';
import { SessionRepository } from 'src/session/session.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class ParticipantService implements IParticipantService {
  constructor(
    @Inject(GatewaySessionManager)
    private readonly gatewayManager: GatewaySessionManager,
    @Inject(FirebaseAdmin) private readonly firebaseAdmin: FirebaseAdmin,
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(forwardRef(() => SessionRepository))
    private readonly sessionRepo: SessionRepository,
    @Inject(ParticipantRepository)
    private readonly participantRepo: ParticipantRepository,
  ) {}

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
