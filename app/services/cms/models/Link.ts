import { z } from "zod";

export const LinkSchema = z.object({
  url: z.string(),
  text: z.string(),
});

export type Link = z.infer<typeof LinkSchema>;
