import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from 'src/participant/entities/participant.entity';
import {
  IParticipantRepository,
  ParticipantRelationOption,
} from 'src/participant/participant.interface';
import { Session } from 'src/session/entities/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParticipantRepository implements IParticipantRepository {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}

  async checkParticipantExistsBySessionCode(
    uid: string,
    code: string,
  ): Promise<void> {
    const session = await this.findSessionByParticipantUid(uid);
    if (!session)
      throw new HttpException(
        { message: 'participant doesnt belong any session' },
        HttpStatus.NOT_FOUND,
      );
    if (session.code !== code)
      throw new HttpException(
        { message: 'participant not in this session' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
  }
  async joinSession(uid: string, sessionId: number): Promise<void> {
    const participant = this.participantRepository.create({
      session: { id: sessionId },
      user: { uid },
    });

    await this.participantRepository.save(participant);
  }
  async checkParticipantAvaibility(uid: string): Promise<void> {
    const session = await this.findSessionByParticipantUid(uid);
    if (session)
      throw new HttpException(
        { message: 'already joined in another session, leave first' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
  }
  async findARandomParticipantbySessionId(id: number): Promise<Participant> {
    return this.participantRepository
      .createQueryBuilder('participant')
      .leftJoinAndSelect('participant.session', 'session')
      .leftJoinAndSelect('participant.user', 'user')
      .where('session.id = :id', { id })
      .orderBy('RANDOM()')
      .getOne();
  }
  async findSessionByParticipantUid(
    uid: string,
    option: ParticipantRelationOption | undefined = undefined,
  ): Promise<Session> {
    const participant = await this.participantRepository.findOne({
      where: { user: { uid } },
      relations: {
        user: option?.user,
        session: {
          host: true,
        },
      },
    });
    if (!participant) return null;
    return participant.session;
  }
  async removeParticipantByUserId(uid: string): Promise<void> {
    await this.participantRepository.delete({ user: { uid: uid } });
  }
  async findParticipantsBySessionId(
    sessionId: number,
  ): Promise<{ userIds: string[] }> {
    const participants = await this.participantRepository.find({
      where: { session: { id: sessionId } },
      relations: {
        user: true,
      },
    });
    if (!participants) return null;
    return {
      userIds: participants.map((participant) => participant.user.uid),
    };
  }
}
