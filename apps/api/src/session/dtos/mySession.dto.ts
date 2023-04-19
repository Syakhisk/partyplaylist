import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { httpResponse, mySession } from 'schema';

const _mySession = extendApi(mySession, {
  title: 'my session info',
});

export class MySessionDTO extends createZodDto(_mySession) {}
export class MySessionDTOResponse extends createZodDto(
  httpResponse(_mySession),
) {}
