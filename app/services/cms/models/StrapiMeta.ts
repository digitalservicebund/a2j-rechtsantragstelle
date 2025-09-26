import { z } from "zod";
import { StrapiStringOptionalSchema } from "./StrapiStringOptional";

export const StrapiMetaSchema = z.object({
  title: z.string(),
  description: StrapiStringOptionalSchema,
  ogTitle: StrapiStringOptionalSchema,
  breadcrumb: StrapiStringOptionalSchema,
});

export const StrapiFlowMetaSchema = z.object({
  title: z.string(),
  breadcrumb: StrapiStringOptionalSchema,
});

export type StrapiMeta = z.infer<typeof StrapiMetaSchema>;
export type StrapiFlowMeta = z.infer<typeof StrapiFlowMetaSchema>;
