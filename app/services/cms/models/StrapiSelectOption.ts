import { z } from "zod";

export const StrapiSelectOptionSchema = z.object({
  text: z.string(),
  value: z.string(),
});
