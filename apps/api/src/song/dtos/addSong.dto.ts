import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { song } from 'schema';
import 'zod';

const addSong = extendApi(song.add, {
  title: 'Add a song to a session',
});

export class AddSongDTO extends createZodDto(addSong) {}
