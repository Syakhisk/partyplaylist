import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { createUserByEmail } from 'schema';
const createUserByEmailZ = extendApi(createUserByEmail, {
  title: 'create User by Email',
  description: 'create User schema and validation',
});

export class CreateUserByEmailDTO extends createZodDto(createUserByEmailZ) {}
