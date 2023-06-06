import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiSelectOptionSchema = z
  .object({
    text: z.string(),
    value: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .strict();

export type StrapiSelectOption = z.infer<typeof StrapiSelectOptionSchema>;
