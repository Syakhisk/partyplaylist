import { CreatedSessionDTO } from 'src/session/dtos/createdSession.dto';
import { SessionDetailDTO } from 'src/session/dtos/getSessionDetail.dto';
import { Session } from 'src/session/entities/session.entity';
import { User } from 'src/user/entities/user.entity';
export type SessionData = {
  userId: string;
  name: string;
};

export type SessionRelationOption = {
  user?: boolean;
  participants?: boolean;
};
export interface ISessionRepository {
  checkSessionAvaibility(userUID: string): Promise<void>;
  checkSessionExistByCode(code: string): Promise<number>;
  addNewSession(sessionData: SessionData): Promise<string>;
  findSessionByHost(
    uid: string,
    option: SessionRelationOption | undefined,
  ): Promise<Session>;
  changeToANewHost(oldSession: Session, newHost: User): Promise<void>;
  endSession(code: string): Promise<void>;
}

export interface ISessionService {
  addNewSession(payload: SessionData): Promise<CreatedSessionDTO>;
  getSessionDetail(requestUID: string, code: string): Promise<SessionDetailDTO>;
  endSession(requestUID: string, code: string): Promise<void>;
}
