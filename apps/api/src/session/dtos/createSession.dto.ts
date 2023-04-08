import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { session } from 'schema';

const createSession = extendApi(session.create, {
  title: 'create Session schema',
});

export class CreateSessionDTO extends createZodDto(createSession) {}
