import { z } from "zod";

export const HasIdSchema = z.object({
  id: z.number().optional(),
});

export type HasId = z.infer<typeof HasIdSchema>;
