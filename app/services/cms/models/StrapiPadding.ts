import { z } from "zod";

export const StrapiPaddingSchema = z.enum([
  "default",
  "px0",
  "px8",
  "px16",
  "px24",
  "px32",
  "px40",
  "px48",
  "px56",
  "px64",
]);

export type StrapiPadding = z.infer<typeof StrapiPaddingSchema>;
