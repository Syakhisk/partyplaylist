import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { httpResponse, createdSession } from 'schema';

const _createdSession = extendApi(createdSession, {
  title: 'created Session schema',
});

export class CreatedSessionDTO extends createZodDto(_createdSession) {}
export class CreatedSessionDTOResponse extends createZodDto(
  httpResponse(_createdSession),
) {}
