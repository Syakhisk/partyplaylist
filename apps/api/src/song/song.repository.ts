import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/song/entities/song.entity';
import {
  ISongRepository,
  NewSongPayload,
  SongActionEnum,
} from 'src/song/song.interface';
import { EntityManager, Repository } from 'typeorm';
import { CreatedSongDTO } from 'src/song/dtos/addedSong.dto';
import { SongsDetailDTO } from 'src/song/dtos/songDetails.dto';

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
    thumbnail_url,
  }: NewSongPayload): Promise<CreatedSongDTO> {
    return this.songRepository.manager.transaction(
      'READ COMMITTED',
      async (tx) => {
        const latestSong = (
          await tx.find(Song, {
            select: { position: true },
            order: { position: 'DESC' },
            lock: { mode: 'pessimistic_write' },
            take: 1,
          })
        ).at(0);

        const newSong = await tx.save(
          tx.create(Song, {
            session: {
              id: sessionId,
            },
            thumbnail_url,
            channel_name,
            song_id,
            song_title,
            song_url,
            position: latestSong ? latestSong.position + 1 : 1,
          }),
        );

        return {
          id: newSong.id,
          position: newSong.position,
        };
      },
    );
  }

  async changeSongById(
    sessionId: number,
    songId: number,
    action: SongActionEnum,
  ): Promise<void> {
    //consistent transaction based on position ASC
    await this.songRepository.manager.transaction(
      'READ COMMITTED',
      async (tx) => {
        const selectedSong = await tx.findOne(Song, {
          select: { position: true, id: true },
          where: { id: songId, session: { id: sessionId } },
          lock: { mode: 'pessimistic_write' },
        });
        if (!selectedSong) throw new NotFoundException();

        switch (action) {
          case 'queueUp':
            if (selectedSong.position <= 1) break;
            const upperSong = await tx.findOne(Song, {
              select: { position: true, id: true },
              where: {
                position: selectedSong.position - 1,
                session: { id: sessionId },
              },
              lock: { mode: 'pessimistic_write' },
            });
            if (!upperSong) break;

            await this.switchSongOrder(tx, upperSong, selectedSong);

            break;
          case 'queueDown':
            const lowerSong = await tx.findOne(Song, {
              select: { position: true, id: true },
              where: {
                position: selectedSong.position + 1,
                session: { id: sessionId },
              },
              lock: { mode: 'pessimistic_write' },
            });
            if (!lowerSong) break;

            await this.switchSongOrder(tx, selectedSong, lowerSong);

            break;
          case 'top': {
            if (selectedSong.position <= 1) break;
            await this.changeSongPositionByPlusOne(
              sessionId,
              selectedSong.position,
              tx,
            );
            await tx.update(
              Song,
              {
                id: selectedSong.id,
              },
              {
                position: 1,
              },
            );
            break;
          }

          case 'bottom': {
            const bottomSong = (
              await tx.find(Song, {
                select: { position: true, id: true },
                where: { session: { id: sessionId } },
                order: { position: 'DESC' },
                lock: { mode: 'pessimistic_write' },
                take: 1,
              })
            ).at(0);
            if (!bottomSong) break;

            await tx.update(
              Song,
              {
                id: selectedSong.id,
              },
              {
                position: bottomSong.position + 1,
              },
            );

            await this.changeSongPositionByMinusOne(
              sessionId,
              selectedSong.position,
              tx,
            );
            break;
          }
        }
      },
    );
  }

  async getSongsBySessionId(sessionId: number): Promise<SongsDetailDTO> {
    const songs = await this.songRepository.find({
      where: { session: { id: sessionId } },
      order: { position: 'ASC' },
    });

    if (!songs) return null;

    return {
      songs,
    };
  }

  async checkSongExistsById(songId: number): Promise<void> {
    const song = await this.songRepository.findOne({
      where: { id: songId },
    });
    if (!song) throw new NotFoundException();
  }

  async deleteSongById(sessionId: number, songId: number): Promise<void> {
    await this.songRepository.manager.transaction(
      'READ COMMITTED',
      async (tx) => {
        const deletedSong = await tx.findOne(Song, {
          where: { session: { id: sessionId }, id: songId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!deletedSong) throw new NotFoundException();

        await tx.delete(Song, { session: { id: sessionId }, id: songId });
        await this.changeSongPositionByMinusOne(
          sessionId,
          deletedSong.position,
          tx,
        );
      },
    );
  }

  private async switchSongOrder(
    tx: EntityManager,
    upperSong: Song,
    lowerSong: Song,
  ): Promise<void> {
    await tx.update(
      Song,
      {
        id: upperSong.id,
      },
      {
        position: lowerSong.position,
      },
    );
    await tx.update(
      Song,
      {
        id: lowerSong.id,
      },
      {
        position: upperSong.position,
      },
    );
  }

  private async changeSongPositionByMinusOne(
    sessionId: number,
    position: number,
    tx: EntityManager | undefined = undefined,
  ) {
    const subQuery = this.songRepository
      .createQueryBuilder('song')
      .setLock('pessimistic_write')
      .select('song.id')
      .leftJoin('session', 'session', 'session.id = song.session.id')
      .where('session.id = :sessionId', { sessionId })
      .andWhere('song.position > :position', {
        position,
      })
      .orderBy('song.position', 'ASC');

    await (tx ?? this.songRepository)
      .createQueryBuilder()
      .update(Song)
      .set({
        position: () => 'position -1',
      })
      .where(`id IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .execute();
  }

  private async changeSongPositionByPlusOne(
    sessionId: number,
    position: number,
    tx: EntityManager | undefined = undefined,
  ) {
    const subQuery = this.songRepository
      .createQueryBuilder('song')
      .setLock('pessimistic_write')
      .select('song.id')
      .leftJoin('session', 'session', 'session.id = song.session.id')
      .where('session.id = :sessionId', { sessionId })
      .andWhere('song.position < :position', {
        position: position,
      })
      .orderBy('song.position', 'ASC');
    await (tx ?? this.songRepository)
      .createQueryBuilder()
      .update(Song)
      .set({
        position: () => 'position + 1',
      })
      .where(`id IN (${subQuery.getQuery()})`)
      .setParameters(subQuery.getParameters())
      .execute();
  }
}
