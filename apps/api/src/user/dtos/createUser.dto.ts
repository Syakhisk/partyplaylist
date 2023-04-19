import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { createUserByFirebase } from 'schema';
import 'zod';
const createUser = extendApi(createUserByFirebase, {
  title: 'createUser by Firebase',
});

export class CreateUserDTO extends createZodDto(createUser) {}
