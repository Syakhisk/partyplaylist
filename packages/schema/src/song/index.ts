import { z } from "zod";

export const addSong = z.object({
  channel_name: z.string(),
  thumbnail_url: z.string(),
  song_id: z.string(),
  song_title: z.string(),
  song_url: z.string(),
});

export type AddSong = z.infer<typeof addSong>;
