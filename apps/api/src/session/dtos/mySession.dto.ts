import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { httpResponse, session } from 'schema';

const mySession = extendApi(session.my, {
  title: 'my session info',
});

export class MySessionDTO extends createZodDto(mySession) {}
export class MySessionDTOResponse extends createZodDto(
  httpResponse(mySession),
) {}
