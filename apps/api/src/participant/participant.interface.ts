import { Participant } from 'src/participant/entities/participant.entity';
import { Session } from 'src/session/entities/session.entity';

export type ParticipantRelationOption = {
  user?: boolean;
  participants?: boolean;
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
