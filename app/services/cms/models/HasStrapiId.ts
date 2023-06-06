import { z } from "zod";

export const HasStrapiIdSchema = z.object({ id: z.number() });
export type HasStrapiId = z.infer<typeof HasStrapiIdSchema>;

export const HasOptionalStrapiIdSchema = z.object({
  id: z.number().optional(),
});
export type HasOptionalStrapiId = z.infer<typeof HasOptionalStrapiIdSchema>;
