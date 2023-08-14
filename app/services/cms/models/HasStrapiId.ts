import { z } from "zod";

export const HasStrapiIdSchema = z.object({ id: z.number() });
export const HasOptionalStrapiIdSchema = z.object({
  id: z.number().optional(),
});
