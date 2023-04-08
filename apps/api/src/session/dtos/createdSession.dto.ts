import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { httpResponse, session } from 'schema';

const createdSession = extendApi(session.created, {
  title: 'created Session schema',
});

export class CreatedSessionDTO extends createZodDto(createdSession) {}
export class CreatedSessionDTOResponse extends createZodDto(
  httpResponse(createdSession),
) {}
