import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { httpResponse } from 'schema';
import { z } from 'zod';

export const createdUser = extendApi(
  z.object({
    id: z.number(),
  }),
  {
    title: 'createdUser response',
  },
);

export class CreatedUserDTO extends createZodDto(createdUser) {}
export class CreatedUserDTOResponse extends createZodDto(
  httpResponse(createdUser),
) {}

export type CreatedUser = z.infer<typeof createdUser>;
