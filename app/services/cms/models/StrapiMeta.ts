import { z } from "zod";

export const StrapiMetaSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  ogTitle: z.string().nullable(),
  breadcrumb: z.string().nullable(),
});

export type StrapiMeta = z.infer<typeof StrapiMetaSchema>;
