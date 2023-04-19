import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { httpResponse, songsDetail } from 'schema';

const _songsDetail = extendApi(songsDetail, {
  title: 'songs detail',
});

export class SongsDetailDTO extends createZodDto(_songsDetail) {}
export class SongsDetailResponseDTO extends createZodDto(
  httpResponse(_songsDetail),
) {}
