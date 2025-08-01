import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { StrapiContentComponentSchema } from "./StrapiContentComponent";

export const StrapiPageSchema = z.object({
  content: z.array(StrapiContentComponentSchema),
  slug: z.string(),
  ...HasStrapiLocaleSchema.shape,
  ...HasStrapiMetaSchema.shape,
});

export type StrapiPage = z.infer<typeof StrapiPageSchema>;
