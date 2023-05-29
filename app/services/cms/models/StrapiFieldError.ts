import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiFieldErrorSchema = z
  .object({
    code: z.string(),
    text: z.string(),
  })
  .merge(HasStrapiIdSchema)
  .strict();

export type StrapiFieldError = z.infer<typeof StrapiFieldErrorSchema>;
