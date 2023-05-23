import { z } from "zod";

export const TimestampableSchema = z.object({
  createdAt: z.string().datetime({ precision: 3 }),
  updatedAt: z.string().datetime({ precision: 3 }),
  publishedAt: z.string().datetime({ precision: 3 }),
});

export type Timestampable = z.infer<typeof TimestampableSchema>;
