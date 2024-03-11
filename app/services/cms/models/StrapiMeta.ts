import { z } from "zod";

export const StrapiMetaSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  ogTitle: z.string().nullable(),
  breadcrumb: z.string(),
});
// technically the object contains an id, but we don't need it
// .merge(HasOptionalStrapiIdSchema);

export type StrapiMeta = z.infer<typeof StrapiMetaSchema>;
