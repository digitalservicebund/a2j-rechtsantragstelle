import { z } from "zod";
import { StrapiFieldErrorSchema } from "./StrapiFieldError";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";

export const StrapiErrorCategorySchema = z
  .object({
    name: z.string(),
    errorCodes: z.array(StrapiFieldErrorSchema),
  })
  .merge(HasStrapiTimestampsSchema)
  .strict();

export type StrapiErrorCategory = z.infer<typeof StrapiErrorCategorySchema>;
