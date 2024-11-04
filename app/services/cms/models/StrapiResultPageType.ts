import { z } from "zod";

export const StrapiResultPageTypeSchema = z.enum([
  "error",
  "success",
  "warning",
  "default",
]);

export type StrapiResultPageType = z.infer<typeof StrapiResultPageTypeSchema>;
