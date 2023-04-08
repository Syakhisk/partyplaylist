import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from 'src/participant/entities/participant.entity';
import { IParticipantRepository } from 'src/participant/participant.interface';
import { Session } from 'src/session/entities/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParticipantRepository implements IParticipantRepository {
  constructor(
    @InjectRepository(Participant)
    private readonly ParticipantRepository: Repository<Participant>,
  ) {}
  async findARandomParticipantbySessionId(id: number): Promise<Participant> {
    return this.ParticipantRepository.createQueryBuilder()
      .select()
      .where('session.id = :id', { id })
      .orderBy('RANDOM()')
      .take(1)
      .getOne();
  }
  async findSessionByParticipantUid(uid: string): Promise<Session> {
    const participant = await this.ParticipantRepository.findOne({
      where: { user: { uid } },
    });
    return participant.session;
  }
  async removeParticipantByUserId(uid: string): Promise<void> {
    await this.ParticipantRepository.createQueryBuilder()
      .delete()
      .where('user.uid = :uid', { uid })
      .execute();
  }
}
