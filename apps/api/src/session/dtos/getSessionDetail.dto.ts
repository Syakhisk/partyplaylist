import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { httpResponse, session } from 'schema';

const sessionDetail = extendApi(session.detail, {
  title: 'created Session schema',
});

export class SessionDetailDTO extends createZodDto(sessionDetail) {}
export class SessionDetailDTOResponse extends createZodDto(
  httpResponse(sessionDetail),
) {}
