import { z } from "zod";

export const createSession = z.object({
  name: z.string(),
});

export type CreateSession = z.infer<typeof createSession>;

export const createdSession = z.object({
  code: z.string(),
})

export type CreatedSession = z.infer<typeof createdSession>;