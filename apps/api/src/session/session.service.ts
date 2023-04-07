import { Inject, Injectable } from '@nestjs/common';
import { GatewaySessionManager } from 'src/gateway/gateway.session';
import { CreatedSessionDTO } from 'src/session/dtos/createdSession.dto';
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

  // @OnEvent(ServerEvent.UserOffline)
  // async handleUserOffline(
  //   payload: ServerEventPayload[ServerEvent.UserOffline],
  // ) {
  //   const sessionHost = await this.sessionRepo.findSessionByHost(payload.uid);
  //   if (!sessionHost) {
  //     return;
  //   }
  //   //TODO: find a new host if host is leaving
  // }
}
