import { z } from "zod";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { StrapiFieldErrorSchema } from "./StrapiFieldError";

export const StrapiErrorCategorySchema = z
  .object({
    name: z.string(),
    errorCodes: z.array(StrapiFieldErrorSchema),
  })
  .merge(HasStrapiTimestampsSchema);
