import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { StrapiContentComponentSchema } from "./StrapiContentComponent";

export const StrapiPageSchema = z
  .object({
    content: z.array(StrapiContentComponentSchema),
    slug: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiMetaSchema);

export type StrapiPage = z.infer<typeof StrapiPageSchema>;
