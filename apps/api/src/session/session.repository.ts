import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { customAlphabet } from 'nanoid/async';
import { Session } from 'src/session/entities/session.entity';
import {
  ISessionRepository,
  SessionRelationOption,
  SessionData,
} from 'src/session/session.interface';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async changeToANewHost(oldSession: Session, newHost: User): Promise<void> {
    oldSession.host = newHost;
    await this.sessionRepository.save(oldSession);
  }
  async checkSessionAvaibility(userUID: string): Promise<void> {
    const session = await this.findSessionByHost(userUID);
    if (session)
      throw new UnprocessableEntityException({
        message: 'user already have a host, must end it first',
      });
  }
  async addNewSession(sessionData: SessionData): Promise<string> {
    const newCode = await SessionRepository.generateCode();
    const session = this.sessionRepository.create({
      code: newCode,
      host: {
        uid: sessionData.userId,
      },
      name: sessionData.name,
    });
    const createdSession = await this.sessionRepository.save(session);
    return createdSession.code;
  }

  async findSessionByHost(
    uid: string,
    option: SessionRelationOption = undefined,
  ): Promise<Session> {
    return this.sessionRepository.findOne({
      where: { host: { uid } },
      relations: {
        host: option?.user,
        participants: option?.participants,
      },
    });
  }
  async endSession(code: string): Promise<void> {
    await this.sessionRepository.delete({ code });
  }

  async checkSessionExistByCode(code: string): Promise<number> {
    const session = await this.sessionRepository.findOne({ where: { code } });
    if (!session) throw new NotFoundException();
    return session.id;
  }

  private static generateCode(): Promise<string> {
    const customValue = '1234567890qwertyuiopasdfghjklzxcvbnm';
    const customNanoFunc = customAlphabet(customValue, 6);
    return customNanoFunc();
  }
}
