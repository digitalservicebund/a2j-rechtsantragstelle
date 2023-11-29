import { z } from "zod";
import { StrapiFormComponentSchema } from "./StrapiFormComponent";
import { StrapiContentSchema } from "./StrapiContent";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { HasStrapiSlugSchema } from "./HasStrapiSlug";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";

export const StrapiVorabCheckPageSchema = z
  .object({
    // eslint-disable-next-line camelcase
    pre_form: z.array(StrapiContentSchema),
    form: z.array(StrapiFormComponentSchema),
    nextButtonLabel: z.string().nullable().optional(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiMetaSchema)
  .merge(HasStrapiSlugSchema)
  .merge(HasStrapiTimestampsSchema);
