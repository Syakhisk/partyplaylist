import { z } from "zod";
import { participants } from "../participant";
import { user } from "../user/user";

export const createSession = z.object({
  name: z.string(),
});

export type CreateSession = z.infer<typeof createSession>;

export const createdSession = z.object({
  code: z.string(),
});

export type CreatedSession = z.infer<typeof createdSession>;

export const joinSession = z.object({
  userId: z.string(),
});

export type JoinSession = z.infer<typeof joinSession>;

export const sessionDetail = z.object({
  code: z.string(),
  name: z.string(),
  host: user,
});

export type SessionDetail = z.infer<typeof sessionDetail>;

// TODO: Remove this and change on all occurrences.
// this is only for backwards compatibility
export const getSessionDetail = sessionDetail;
export type GetSessionDetail = z.infer<typeof getSessionDetail>;

export const mySession = z.object({
  ...getSessionDetail.shape,
  ...participants.shape,
});

export type MySession = z.infer<typeof mySession>;
