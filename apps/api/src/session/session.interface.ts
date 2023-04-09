import { CreatedSessionDTO } from 'src/session/dtos/createdSession.dto';
import { ParticipantsDTO } from 'src/session/dtos/getParticipants.dto';
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
export type LeaveSession = {
  requestUID: string;
  userId: string;
  code: string;
};
export interface ISessionService {
  addNewSession(payload: SessionData): Promise<CreatedSessionDTO>;
  joinASession(userId: string, sessionCode: string): Promise<void>;
  leaveASession(payload: LeaveSession): Promise<void>;
  getSessionDetail(requestUID: string, code: string): Promise<SessionDetailDTO>;
  endSession(requestUID: string, code: string): Promise<void>;
  getParticipantsBySessionCode(
    requiestUID: string,
    code: string,
  ): Promise<ParticipantsDTO>;
}
