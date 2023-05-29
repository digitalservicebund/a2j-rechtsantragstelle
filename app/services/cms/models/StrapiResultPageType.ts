import { z } from "zod";

export const StrapiResultPageTypeSchema = z.enum([
  "error",
  "success",
  "warning",
]);

export type StrapiResultPageType = z.infer<typeof StrapiResultPageTypeSchema>;
