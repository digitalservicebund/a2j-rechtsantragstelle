import { z } from "zod";
import { StrapiStringOptionalSchema } from "~/services/cms/models/StrapiStringOptional";

export const StrapiLinkSchema = z.object({
  url: z.string(),
  text: StrapiStringOptionalSchema,
});

export type StrapiLink = z.infer<typeof StrapiLinkSchema>;
