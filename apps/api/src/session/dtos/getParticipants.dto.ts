import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { httpResponse, participant } from 'schema';

const participants = extendApi(participant.participants);

export class ParticipantsDTO extends createZodDto(participants) {}
export class ParticipantsDTOResponse extends createZodDto(
  httpResponse(participants),
) {}
