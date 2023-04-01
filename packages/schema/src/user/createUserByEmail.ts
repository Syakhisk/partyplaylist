import { z } from "zod";

export const createUserByEmail = z.object({
  email: z.string().trim().nonempty().toLowerCase().email(),
  password: z.string().min(6),
  firstName: z.string().nonempty().trim(),
  lastName: z.string().nonempty().trim(),
  photoUUID: z.string().uuid().nullable(),
});

export type CreateUserByEmail = z.infer<typeof createUserByEmail>