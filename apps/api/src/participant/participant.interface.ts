import { Participant } from 'src/participant/entities/participant.entity';
import { Session } from 'src/session/entities/session.entity';

export interface IParticipantRepository {
  findSessionByParticipantUid(uid: string): Promise<Session>;
  removeParticipantByUserId(uid: string): Promise<void>;
  findARandomParticipantbySessionId(id: number): Promise<Participant>;
}
