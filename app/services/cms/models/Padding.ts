import { z } from "zod";

export const PaddingSchema = z.union([
  z.literal("default"),
  z.literal("px0"),
  z.literal("px8"),
  z.literal("px16"),
  z.literal("px24"),
  z.literal("px32"),
  z.literal("px40"),
  z.literal("px48"),
  z.literal("px56"),
  z.literal("px64"),
]);

export type Padding = z.infer<typeof PaddingSchema>;
