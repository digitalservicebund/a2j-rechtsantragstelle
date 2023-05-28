import { z } from "zod";
import { HasIdSchema } from "./HasId";

export const StrapiSelectOptionSchema = z
  .object({
    text: z.string(),
    value: z.string(),
  })
  .merge(HasIdSchema)
  .strict();

export type StrapiSelectOption = z.infer<typeof StrapiSelectOptionSchema>;
