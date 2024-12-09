import { z } from "zod";

export const StrapiFieldErrorSchema = z.object({
  code: z.string(),
  text: z.string(),
});
