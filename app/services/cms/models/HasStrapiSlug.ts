import { z } from "zod";

export const HasStrapiSlugSchema = z.object({
  slug: z.string(),
});

export type HasStrapiSlug = z.infer<typeof HasStrapiSlugSchema>;
