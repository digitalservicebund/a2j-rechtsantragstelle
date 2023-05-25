import { z } from "zod";

export const LinkSchema = z.object({
  id: z.number(),
  url: z.string().nullable(),
  text: z.string().nullable(),
});

export type Link = z.infer<typeof LinkSchema>;
