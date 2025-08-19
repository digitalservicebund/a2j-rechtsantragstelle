import { z } from "zod";
import { StrapiContentComponentSchema } from "./formElements/StrapiContentComponent";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";

export const StrapiPageSchema = z.object({
  content: z.array(StrapiContentComponentSchema),
  slug: z.string(),
  ...HasStrapiLocaleSchema.shape,
  ...HasStrapiMetaSchema.shape,
});

export type StrapiPage = z.infer<typeof StrapiPageSchema>;
