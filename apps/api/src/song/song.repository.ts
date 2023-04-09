import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/song/entities/song.entity';
import { ISongRepository } from 'src/song/song.interface';
import { Session } from 'src/session/entities/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SongRepository implements ISongRepository {
  constructor(
    @InjectRepository(Song)
    private readonly SongRepository: Repository<Song>,
  ) {}
}
