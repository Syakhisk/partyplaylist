import { CreatedSessionDTO } from 'src/session/dtos/createdSession.dto';
export type SessionData = {
  userId: string;
  name: string;
};
export interface ISessionRepository {
  addNewSession(sessionData: SessionData): Promise<string>;
}

export interface ISessionService {
  addNewSession(payload: SessionData): Promise<CreatedSessionDTO>;
}
