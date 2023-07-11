import { z } from "zod";
import { StrapiContentSchema } from "./StrapiContent";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { HasStrapiSlugSchema } from "./HasStrapiSlug";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { HasStrapiVersionsSchema } from "./HasStrapiVersions";

export const StrapiPageSchema = z
  .object({
    content: z.array(StrapiContentSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiMetaSchema)
  .merge(HasStrapiSlugSchema)
  .merge(HasStrapiTimestampsSchema)
  .merge(HasStrapiVersionsSchema)
  .strict();

export type StrapiPage = z.infer<typeof StrapiPageSchema>;
