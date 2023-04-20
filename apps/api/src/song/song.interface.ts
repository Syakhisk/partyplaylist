import { AddSongDTO } from 'src/song/dtos/addSong.dto';
import { CreatedSongDTO } from 'src/song/dtos/addedSong.dto';
import { AddSong } from 'schema';
import { SongsDetailDTO } from 'src/song/dtos/songDetails.dto';
export type NewSongPayload = {
  sessionId: number;
} & AddSong;

export type SongActionPayload = {
  requestId: string;
  sessionCode: string;
  songId: number;
  action: SongActionEnum;
};
export type SongActionEnum = 'queueUp' | 'queueDown' | 'top' | 'bottom';

export interface ISongRepository {
  addNewSong(newSong: NewSongPayload): Promise<CreatedSongDTO>;
  changeSongById(
    sessionId: number,
    songId: number,
    action: SongActionEnum,
  ): Promise<void>;
  getSongsBySessionId(sessionId: number): Promise<SongsDetailDTO>;
  checkSongExistsById(songId: number): Promise<void>;
  deleteSongById(sessionId: number, songId: number): Promise<void>;
}

export interface ISongService {
  addNewSong(
    sessionCode: string,
    requestId: string,
    song: AddSongDTO,
  ): Promise<CreatedSongDTO>;

  changeSong(songActionPayload: SongActionPayload): Promise<void>;

  getSongsBySessionCode(
    requestId: string,
    sessionCode: string,
  ): Promise<SongsDetailDTO>;

  deleteSong(
    requestId: string,
    sessionCode: string,
    songId: number,
  ): Promise<void>;
}
