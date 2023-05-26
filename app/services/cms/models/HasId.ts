import { z } from "zod";

export const HasIdSchema = z.object({
  id: z.number(),
});

export type HasId = z.infer<typeof HasIdSchema>;
