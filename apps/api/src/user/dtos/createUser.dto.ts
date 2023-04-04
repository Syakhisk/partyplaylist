import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { user } from 'schema';
import 'zod';
const createUser = extendApi(user.createByFirebase, {
  title: 'createUser by Firebase',
});

export class CreateUserDTO extends createZodDto(createUser) {}
