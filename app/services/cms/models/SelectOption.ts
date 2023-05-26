import { z } from "zod";
import { HasIdSchema } from "./HasId";

export const SelectOptionSchema = z
  .object({
    text: z.string(),
    value: z.string(),
  })
  .merge(HasIdSchema)
  .strict();

export type SelectOption = z.infer<typeof SelectOptionSchema>;
