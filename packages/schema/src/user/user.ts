import { z } from "zod";

export const user = z.object({
  uid: z.string(),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  photoURL: z.string().optional(),
});

export type User = z.infer<typeof user>;
