import { CreatedSessionDTO } from 'src/session/dtos/createdSession.dto';
import { Session } from 'src/session/entities/session.entity';
import { User } from 'src/user/entities/user.entity';
export type SessionData = {
  userId: string;
  name: string;
};
export interface ISessionRepository {
  checkSessionAvaibility(userUID: string): Promise<void>;
  addNewSession(sessionData: SessionData): Promise<string>;
  findSessionByHost(uid: string): Promise<Session>;
  changeToANewHost(oldSession: Session, newHost: User): Promise<void>;
}

export interface ISessionService {
  addNewSession(payload: SessionData): Promise<CreatedSessionDTO>;
}
