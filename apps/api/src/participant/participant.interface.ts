import { ParticipantsDTO } from 'src/participant/dtos/getParticipants.dto';
import { Participant } from 'src/participant/entities/participant.entity';
import { Session } from 'src/session/entities/session.entity';

export type ParticipantRelationOption = {
  user?: boolean;
  participants?: boolean;
};
export type LeaveSession = {
  requestUID: string;
  userId: string;
  code: string;
};
export interface IParticipantRepository {
  findSessionByParticipantUid(
    uid: string,
    option: ParticipantRelationOption | undefined,
  ): Promise<Session>;
  removeParticipantByUserId(uid: string): Promise<void>;
  findARandomParticipantbySessionId(id: number): Promise<Participant>;
  checkParticipantAvaibility(uid: string): Promise<void>;
  checkParticipantExistsBySessionCode(uid: string, code: string): Promise<void>;
  joinSession(uid: string, sessionId: number): Promise<void>;
  findParticipantsBySessionId(
    sessionId: number,
  ): Promise<{ userIds: string[] }>;
}
export interface IParticipantService {
  getParticipantsBySessionCode(
    requestUID: string,
    code: string,
  ): Promise<ParticipantsDTO>;
  kickByHostOrLeaveSession(payload: LeaveSession): Promise<void>;
}
