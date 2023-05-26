import { z } from "zod";

export const HasTimestampsSchema = z.object({
  createdAt: z.string().datetime({ precision: 3 }),
  updatedAt: z.string().datetime({ precision: 3 }),
  publishedAt: z.string().datetime({ precision: 3 }),
});

export type HasTimestamps = z.infer<typeof HasTimestampsSchema>;
