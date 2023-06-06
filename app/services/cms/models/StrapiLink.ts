import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiLinkSchema = z
  .object({
    url: z.string().nullable(),
    text: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .strict();

export type StrapiLink = z.infer<typeof StrapiLinkSchema>;
