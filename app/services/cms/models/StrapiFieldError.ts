import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiFieldErrorSchema = z
  .object({
    code: z.string(),
    text: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);
