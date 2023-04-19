import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { createdSong, httpResponse } from 'schema';

const _createdSong = extendApi(createdSong, {
  title: 'created song by a session',
});

export class CreatedSongDTO extends createZodDto(_createdSong) {}
export class CreatedSongDTOResponse extends createZodDto(
  httpResponse(_createdSong),
) {}
