import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiSelectOptionSchema = z
  .object({
    text: z.string(),
    value: z.string(),
  })
  .merge(HasStrapiIdSchema)
  .strict();

export type StrapiSelectOption = z.infer<typeof StrapiSelectOptionSchema>;
