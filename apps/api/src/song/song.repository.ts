import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/song/entities/song.entity';
import { ISongRepository, NewSongPayload, SongActionEnum } from 'src/song/song.interface';
import { Repository } from 'typeorm';
import { CreatedSongDTO } from 'src/song/dtos/addedSong.dto';

@Injectable()
export class SongRepository implements ISongRepository {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) {}

  async addNewSong({
    sessionId,
    song_id,
    song_title,
    song_url,
    channel_name,
  }: NewSongPayload): Promise<CreatedSongDTO> {
    await this.songRepository.queryRunner.startTransaction('READ COMMITTED');
    try {
      const latestSong = await this.songRepository.findOne({
        select: { position: true },
        order: { position: 'DESC' },
        lock: { mode: 'pessimistic_write' },
      });

      const newSong = await this.songRepository.save(
        this.songRepository.create({
          session: {
            id: sessionId,
          },
          channel_name,
          song_id,
          song_title,
          song_url,
          position: latestSong ? latestSong.position + 1 : 0,
        }),
      );

      await this.songRepository.queryRunner.commitTransaction();
      return {
        songId: newSong.id,
        position: newSong.position,
      };
    } catch (e) {
      await this.songRepository.queryRunner.rollbackTransaction();
    } finally {
      await this.songRepository.queryRunner.release();
    }
  }

  async changeSongById(sessionId: string, songId: string, action: SongActionEnum): Promise<void> {
    await this.songRepository.queryRunner.startTransaction('READ COMMITTED');
    try {
      const selectedSong = await this.songRepository.findOne({
        select: { position: true },
        where: { song_id: songId, session: {id: +sessionId}},
        order: { position: 'DESC' },
        lock: { mode: 'pessimistic_write' },
      });
      switch (action) {
        case 'queueUp':
          
        case 'queueDown':
        case 'top':
        case 'bottom':
      }
      const newSong = await this.songRepository.

      await this.songRepository.queryRunner.commitTransaction();
    } catch (e) {
      await this.songRepository.queryRunner.rollbackTransaction();
    } finally {
      await this.songRepository.queryRunner.release();
    }
  }
}
