import { z } from "zod";
import { FieldErrorSchema } from "./FieldError";

export const ErrorCategorySchema = z.object({
  name: z.string(),
  errorCodes: z.array(FieldErrorSchema),
});

export type ErrorCategory = z.infer<typeof ErrorCategorySchema>;
