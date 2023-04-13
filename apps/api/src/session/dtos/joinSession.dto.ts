import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { session } from 'schema';

const joinSession = extendApi(session.join, {
  title: 'created Session schema',
});

export class JoinSessionDTO extends createZodDto(joinSession) {}
