import { z } from "zod";

export const createUserByFirebase = z.object({
  uid: z.string(),
});

export type CreateUserByFirebase = z.infer<typeof createUserByFirebase>;
