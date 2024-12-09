import { z } from "zod";
import { StrapiFieldErrorSchema } from "./StrapiFieldError";

export const StrapiErrorCategorySchema = z.object({
  name: z.string(),
  errorCodes: z.array(StrapiFieldErrorSchema),
});
