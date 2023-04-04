import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { httpResponse, user } from 'schema';

const createdUser = extendApi(user.createdByFirebase, {
  title: 'createUser by Firebase',
});
export class CreatedUserDTO extends createZodDto(createdUser) {}
export class CreatedUserDTOResponse extends createZodDto(
  httpResponse(createdUser),
) {}
