import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/song/entities/song.entity';
import {
  ISongRepository,
  NewSongPayload,
  SongActionEnum,
} from 'src/song/song.interface';
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
          position: latestSong ? latestSong.position + 1 : 1,
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

  async changeSongById(
    sessionId: number,
    songId: string,
    action: SongActionEnum,
  ): Promise<void> {
    await this.songRepository.queryRunner.startTransaction('READ COMMITTED');
    try {
      const selectedSong = await this.songRepository.findOne({
        select: { position: true, id: true },
        where: { song_id: songId, session: { id: sessionId } },
        lock: { mode: 'pessimistic_write' },
      });
      if (!selectedSong) return;

      switch (action) {
        case 'queueUp':
          if (selectedSong.position <= 1) break;
          const upperSong = await this.songRepository.findOne({
            select: { position: true, id: true },
            where: { position: selectedSong.position - 1 },
          });
          await this.songRepository.update(
            {
              id: upperSong.id,
            },
            {
              position: selectedSong.position,
            },
          );
          await this.songRepository.update(
            {
              id: selectedSong.id,
            },
            {
              position: selectedSong.position - 1,
            },
          );
          break;
        case 'queueDown':
          const lowerSong = await this.songRepository.findOne({
            select: { position: true, id: true },
            where: { position: selectedSong.position + 1 },
          });
          if (!lowerSong) break;

          await this.songRepository.update(
            {
              id: selectedSong.id,
            },
            {
              position: selectedSong.position + 1,
            },
          );
          await this.songRepository.update(
            {
              id: lowerSong.id,
            },
            {
              position: selectedSong.position,
            },
          );
          break;
        case 'top':
          if (selectedSong.position <= 1) break;
          await this.songRepository
            .createQueryBuilder()
            .update(Song)
            .set({
              position: () => 'position +1',
            })
            .where('position < :position', { position: selectedSong.position })
            .execute();
          await this.songRepository.update(
            {
              id: selectedSong.id,
            },
            {
              position: 1,
            },
          );
        case 'bottom':
          const bottomSong = await this.songRepository.findOne({
            select: { position: true, id: true },
            order: { position: 'DESC' },
          });
          if (!bottomSong) break;
          await this.songRepository
            .createQueryBuilder()
            .update(Song)
            .set({
              position: () => 'position -1',
            })
            .where('position > :position', { position: selectedSong.position })
            .execute();
          await this.songRepository.update(
            {
              id: selectedSong.id,
            },
            {
              position: bottomSong.position,
            },
          );
          break;
      }

      await this.songRepository.queryRunner.commitTransaction();
    } catch (e) {
      await this.songRepository.queryRunner.rollbackTransaction();
    } finally {
      await this.songRepository.queryRunner.release();
    }
  }
}
