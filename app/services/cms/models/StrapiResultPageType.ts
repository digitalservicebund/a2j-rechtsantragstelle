import { z } from "zod";

export const StrapiResultPageTypeSchema = z.enum([
  "error",
  "success",
  "warning",
  "info",
]);

export type StrapiResultPageType = z.infer<typeof StrapiResultPageTypeSchema>;
