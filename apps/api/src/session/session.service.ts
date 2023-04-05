import { Inject, Injectable } from '@nestjs/common';
import { CreatedSessionDTO } from 'src/session/dtos/createdSession.dto';
import { ISessionService, SessionData } from 'src/session/session.interface';
import { SessionRepository } from 'src/session/session.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class SessionService implements ISessionService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(SessionRepository) private readonly sessionRepo: SessionRepository,
  ) {}
  async addNewSession(payload: SessionData): Promise<CreatedSessionDTO> {
    await this.userRepo.checkUserExist(payload.name);
    const createdSessionCode = await this.sessionRepo.addNewSession(payload);
    return {
      code: createdSessionCode,
    };
  }
}
