import { z } from "zod";

export const StrapiTranslationSchema = z.object({
  field: z.array(z.object({ name: z.string(), value: z.string() })),
});
