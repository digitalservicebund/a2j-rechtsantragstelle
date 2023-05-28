import { z } from "zod";
import { FieldErrorSchema } from "./FieldError";
import { HasTimestampsSchema } from "./HasTimestamps";

export const StrapiErrorCategorySchema = z
  .object({
    name: z.string(),
    errorCodes: z.array(FieldErrorSchema),
  })
  .merge(HasTimestampsSchema)
  .strict();

export type StrapiErrorCategory = z.infer<typeof StrapiErrorCategorySchema>;
