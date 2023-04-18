import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { addSong } from 'schema';
import 'zod';

const _addSong = extendApi(addSong, {
  title: 'Add a song to a session',
});

export class AddSongDTO extends createZodDto(_addSong) {}
