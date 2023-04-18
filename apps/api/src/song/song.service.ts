import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { GatewaySessionManager } from 'src/gateway/gateway.session';
import { ParticipantRepository } from 'src/participant/participant.repository';
import { SessionRepository } from 'src/session/session.repository';
import { AddSongDTO } from 'src/song/dtos/addSong.dto';
import { CreatedSongDTO } from 'src/song/dtos/addedSong.dto';
import { ISongService, SongActionPayload } from 'src/song/song.interface';
import { SongRepository } from 'src/song/song.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class SongService implements ISongService {
  constructor(
    @Inject(GatewaySessionManager)
    private readonly gatewayManager: GatewaySessionManager,
    @Inject(SongRepository)
    private readonly songRepo: SongRepository,
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(SessionRepository) private readonly sessionRepo: SessionRepository,
    @Inject(ParticipantRepository)
    private readonly participantRepo: ParticipantRepository,
  ) {}

  async addNewSong(
    sessionCode: string,
    requestId: string,
    song: AddSongDTO,
  ): Promise<CreatedSongDTO> {
    await this.userRepo.checkUserExist(requestId);
    const sessionId = await this.sessionRepo.checkSessionExistByCode(
      sessionCode,
    );
    const session =
      (await this.participantRepo.findSessionByParticipantUid(requestId)) ??
      (await this.sessionRepo.findSessionByHost(requestId));
    if (!session)
      throw new ForbiddenException({
        message: 'not belong to a corresponding session',
      });
    if (session.code !== sessionCode)
      throw new ForbiddenException({
        message: 'trying to accessing a different session',
      });
    return this.songRepo.addNewSong({ sessionId, ...song });
  }

  async changeSong({
    requestId,
    sessionCode,
    songId,
    action,
  }: SongActionPayload): Promise<void> {
    await this.userRepo.checkUserExist(requestId);
    const sessionId = await this.sessionRepo.checkSessionExistByCode(
      sessionCode,
    );
    const session =
      (await this.participantRepo.findSessionByParticipantUid(requestId)) ??
      (await this.sessionRepo.findSessionByHost(requestId));
    if (!session)
      throw new ForbiddenException({
        message: 'not belong to a corresponding session',
      });
    if (session.code !== sessionCode)
      throw new ForbiddenException({
        message: 'trying to accessing a different session',
      });

    this.songRepo.changeSongById(sessionId, songId, action);
  }
}
