import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { customAlphabet } from 'nanoid';
import { Session } from 'src/session/entities/session.entity';
import { ISessionRepository, SessionData } from 'src/session/session.interface';
import { Repository } from 'typeorm';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}
  async addNewSession(sessionData: SessionData): Promise<string> {
    const newCode = SessionRepository.generateCode();
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

  private static generateCode(): string {
    const customValue = '1234567890qwertyuiopasdfghjklzxcvbnm';
    const customNanoFunc = customAlphabet(customValue, 6);
    return customNanoFunc();
  }
}
