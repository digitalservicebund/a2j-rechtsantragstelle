import { z } from "zod";

export const HasStrapiIdSchema = z.object({
  id: z.number().optional(),
});

export type HasStrapiId = z.infer<typeof HasStrapiIdSchema>;
