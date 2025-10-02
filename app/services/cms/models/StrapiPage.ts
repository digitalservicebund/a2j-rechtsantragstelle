import { z } from "zod";
import { StrapiContentComponentSchema } from "./formElements/StrapiContentComponent";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StrapiMetaSchema } from "./StrapiMeta";

export const StrapiPageSchema = z.object({
  content: z.array(StrapiContentComponentSchema),
  slug: z.string(),
  ...HasStrapiLocaleSchema.shape,
  pageMeta: StrapiMetaSchema,
});

export type StrapiPage = z.infer<typeof StrapiPageSchema>;
