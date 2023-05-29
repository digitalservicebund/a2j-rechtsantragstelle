import { z } from "zod";
import { StrapiContentSchema } from "./StrapiContent";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { HasStrapiSlugSchema } from "./HasStrapiSlug";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";

export const StrapiPageSchema = z
  .object({
    content: z.array(StrapiContentSchema),
  })
  .merge(HasStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiMetaSchema)
  .merge(HasStrapiSlugSchema)
  .merge(HasStrapiTimestampsSchema)
  .strict();

export type StrapiPage = z.infer<typeof StrapiPageSchema>;
