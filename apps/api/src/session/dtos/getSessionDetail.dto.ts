import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { httpResponse, getSessionDetail } from 'schema';

const sessionDetail = extendApi(getSessionDetail, {
  title: 'Session detail schema',
});

export class SessionDetailDTO extends createZodDto(sessionDetail) {}
export class SessionDetailDTOResponse extends createZodDto(
  httpResponse(sessionDetail),
) {}
