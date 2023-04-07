import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { customAlphabet } from 'nanoid/async';
import { Session } from 'src/session/entities/session.entity';
import { ISessionRepository, SessionData } from 'src/session/session.interface';
import { Repository } from 'typeorm';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}
  async checkSessionAvaibility(userUID: string): Promise<void> {
    const session = await this.findSessionByHost(userUID);
    if (session)
      throw new HttpException(
        { message: 'user already have a host, must end it first' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
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

  async findSessionByHost(uid: string): Promise<Session> {
    return this.sessionRepository.findOne({
      where: { host: { uid } },
    });
  }
  private static generateCode(): Promise<string> {
    const customValue = '1234567890qwertyuiopasdfghjklzxcvbnm';
    const customNanoFunc = customAlphabet(customValue, 6);
    return customNanoFunc();
  }
}
