import { z } from "zod";
import { StrapiFormComponentSchema } from "./StrapiFormComponent";
import { StrapiContentSchema } from "./StrapiContent";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { HasStrapiSlugSchema } from "./HasStrapiSlug";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";

export const StrapiFormFlowPageSchema = z
  .object({
    heading: z.string(),
    preHeading: z.string().nullable(),
    nextButtonLabel: z.string().nullable(),
    // eslint-disable-next-line camelcase
    pre_form: z.array(StrapiContentSchema),
    form: z.array(StrapiFormComponentSchema),
    // eslint-disable-next-line camelcase
    post_form: z.array(StrapiContentSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiMetaSchema)
  .merge(HasStrapiSlugSchema)
  .merge(HasStrapiTimestampsSchema);
