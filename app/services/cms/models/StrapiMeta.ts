import { z } from "zod";
import { StrapiStringOptionalSchema } from "./StrapiStringOptional";

export const StrapiMetaSchema = z.object({
  title: z.string(),
  description: StrapiStringOptionalSchema,
  ogTitle: StrapiStringOptionalSchema,
  breadcrumb: StrapiStringOptionalSchema,
});

export type StrapiMeta = z.infer<typeof StrapiMetaSchema>;
