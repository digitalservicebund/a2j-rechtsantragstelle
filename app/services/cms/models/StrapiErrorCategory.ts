import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiFieldErrorSchema } from "./StrapiFieldError";

export const StrapiErrorCategorySchema = z.object({
  name: z.string(),
  errorCodes: z.array(StrapiFieldErrorSchema),
  ...HasStrapiIdSchema.shape,
});
