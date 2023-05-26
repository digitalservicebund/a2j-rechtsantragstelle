import { z } from "zod";
import { FieldErrorSchema } from "./FieldError";
import { HasTimestampsSchema } from "./HasTimestamps";

export const ErrorCategorySchema = z
  .object({
    name: z.string(),
    errorCodes: z.array(FieldErrorSchema),
  })
  .merge(HasTimestampsSchema)
  .strict();

export type ErrorCategory = z.infer<typeof ErrorCategorySchema>;
