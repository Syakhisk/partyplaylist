import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { putSong } from 'schema';

const _putSong = extendApi(putSong, {
  title: 'put Song schema',
});

export class PutSongDTO extends createZodDto(_putSong) {}
