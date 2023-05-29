import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiLinkSchema = z
  .object({
    url: z.string().nullable(),
    text: z.string().nullable(),
  })
  .merge(HasStrapiIdSchema)
  .strict();

export type StrapiLink = z.infer<typeof StrapiLinkSchema>;
