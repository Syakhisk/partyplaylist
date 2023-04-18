import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { createSession } from 'schema';

const _createSession = extendApi(createSession, {
  title: 'create Session schema',
});

export class CreateSessionDTO extends createZodDto(_createSession) {}
