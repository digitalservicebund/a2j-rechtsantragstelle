import { z } from "zod";

export const pageDataSchema = z.object({
  arrayIndexes: z.array(z.number()),
});

export type PageData = z.infer<typeof pageDataSchema>;
