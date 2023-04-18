import { AddSongDTO } from 'src/song/dtos/addSong.dto';
import { CreatedSongDTO } from 'src/song/dtos/addedSong.dto';
import { AddSong } from 'schema';
export type NewSongPayload = {
  sessionId: number;
} & AddSong;

export type SongActionEnum = 'queueUp' | 'queueDown' | 'top' | 'bottom';
export interface ISongRepository {
  addNewSong(newSong: NewSongPayload): Promise<CreatedSongDTO>;
  changeSongById(
    sessionId: string,
    songId: string,
    action: SongActionEnum,
  ): Promise<void>;
}
export type SongActionPayload = {
  requestId: string;
  sessionCode: string;
  songId: string;
  action: SongActionEnum;
};
export interface ISongService {
  addNewSong(
    sessionCode: string,
    requestId: string,
    song: AddSongDTO,
  ): Promise<CreatedSongDTO>;
  changeSong(songActionPayload: SongActionPayload): Promise<void>;
}
