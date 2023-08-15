import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiLinkSchema = z
  .object({
    url: z.string(),
    text: z.string().nullable(),
    openInNewTab: z.boolean().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

export type StrapiLink = z.infer<typeof StrapiLinkSchema>;
