import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { httpResponse, participants as Sparticipants } from 'schema';

const participants = extendApi(Sparticipants);

export class ParticipantsDTO extends createZodDto(participants) {}
export class ParticipantsDTOResponse extends createZodDto(
  httpResponse(participants),
) {}
