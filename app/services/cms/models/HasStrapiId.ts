import { z } from "zod";

export const HasStrapiIdSchema = z.object({
  id: z.number().int().nonnegative(),
});
