import { z } from "zod";

export const createdUserByFirebase = z.object({
  uid: z.string(),
});

export type CreatedUserByFirebase = z.infer<typeof createdUserByFirebase>;
