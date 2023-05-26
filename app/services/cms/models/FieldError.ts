import { z } from "zod";
import { HasIdSchema } from "./HasId";

export const FieldErrorSchema = z
  .object({
    code: z.string(),
    text: z.string(),
  })
  .merge(HasIdSchema)
  .strict();

export type FieldError = z.infer<typeof FieldErrorSchema>;
