import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { GatewaySessionManager } from 'src/gateway/gateway.session';
import { ParticipantRepository } from 'src/participant/participant.repository';
import { SessionRepository } from 'src/session/session.repository';
import { AddSongDTO } from 'src/song/dtos/addSong.dto';
import { CreatedSongDTO } from 'src/song/dtos/addedSong.dto';
import { SongsDetailDTO } from 'src/song/dtos/songDetails.dto';
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
    const sessionId = await this.validateSession(requestId, sessionCode);
    return this.songRepo.addNewSong({ sessionId, ...song });
  }

  async changeSong({
    requestId,
    sessionCode,
    songId,
    action,
  }: SongActionPayload): Promise<void> {
    const sessionId = await this.validateSession(requestId, sessionCode);
    await this.songRepo.checkSongExistsById(songId);
    await this.songRepo.changeSongById(sessionId, songId, action);
  }

  async getSongsBySessionCode(
    requestId: string,
    sessionCode: string,
  ): Promise<SongsDetailDTO> {
    const sessionId = await this.validateSession(requestId, sessionCode);
    return this.songRepo.getSongsBySessionId(sessionId);
  }

  private async validateSession(requestId: string, sessionCode: string) {
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
    return sessionId;
  }
}
