import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { joinSession } from 'schema';

const _joinSession = extendApi(joinSession, {
  title: 'created Session schema',
});

export class JoinSessionDTO extends createZodDto(_joinSession) {}
