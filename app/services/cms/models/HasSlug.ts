import { z } from "zod";

export const HasSlugSchema = z.object({
  slug: z.string(),
});

export type HasSlug = z.infer<typeof HasSlugSchema>;
