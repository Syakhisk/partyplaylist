import { z } from "zod";

export const addSong = z.object({
  channel_name: z.string(),
  thumbnail_url: z.string(),
  song_id: z.string(),
  song_title: z.string(),
  song_url: z.string(),
});

export type AddSong = z.infer<typeof addSong>;

export const createdSong = z.object({
  songId: z.number(),
  position: z.number(),
});

export const putSong = z.object({
  action: z.enum(["queueUp", "queueDown", "top", "bottom"]),
});

export type PutSong = z.infer<typeof putSong>;

export type CreatedSong = z.infer<typeof createdSong>;
