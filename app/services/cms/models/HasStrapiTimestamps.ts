import { z } from "zod";

export const HasStrapiTimestampsSchema = z.object({
  createdAt: z.string().datetime({ precision: 3 }),
  updatedAt: z.string().datetime({ precision: 3 }),
  publishedAt: z.string().datetime({ precision: 3 }),
});

export type HasStrapiTimestamps = z.infer<typeof HasStrapiTimestampsSchema>;
