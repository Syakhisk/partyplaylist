import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { createdUserByFirebase, httpResponse } from 'schema';

const createdUser = extendApi(createdUserByFirebase, {
  title: 'createUser by Firebase',
});
export class CreatedUserDTO extends createZodDto(createdUser) {}
export class CreatedUserDTOResponse extends createZodDto(
  httpResponse(createdUser),
) {}
