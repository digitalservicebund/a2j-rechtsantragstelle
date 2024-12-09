import { z } from "zod";

export const StrapiLinkSchema = z.object({
  url: z.string(),
  text: z.string().nullable(),
});

export type StrapiLink = z.infer<typeof StrapiLinkSchema>;
