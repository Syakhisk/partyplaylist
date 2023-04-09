import { z } from "zod";
import { user } from "../user/user";

export const participants = z.object({
  participants: z.array(user),
});

export type Participants = z.infer<typeof participants>;
