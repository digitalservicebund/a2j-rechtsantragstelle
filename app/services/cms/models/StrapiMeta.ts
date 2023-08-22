import { z } from "zod";

export const StrapiMetaSchema = z.object({
  title: z.string(),
  description: z.string().nullish(),
  ogTitle: z.string().nullish(),
});
// technically the object contains an id, but we don't need it
// .merge(HasOptionalStrapiIdSchema);

export type StrapiMeta = z.infer<typeof StrapiMetaSchema>;
