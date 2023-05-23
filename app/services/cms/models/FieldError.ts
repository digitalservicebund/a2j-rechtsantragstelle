import { z } from "zod";

export const FieldErrorSchema = z.object({
  code: z.string(),
  text: z.string(),
});

export type FieldError = z.infer<typeof FieldErrorSchema>;
