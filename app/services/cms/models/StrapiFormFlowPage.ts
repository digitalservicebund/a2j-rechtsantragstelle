import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { HasStrapiSlugSchema } from "./HasStrapiSlug";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { StrapiContentComponentSchema } from "./StrapiContentComponent";
import { StrapiFormComponentSchema } from "./StrapiFormComponent";

export const StrapiFormFlowPageSchema = z
  .object({
    heading: z.string(),
    preHeading: z.string().nullable(),
    nextButtonLabel: z.string().nullable(),
    // eslint-disable-next-line camelcase
    pre_form: z.array(StrapiContentComponentSchema),
    form: z.array(StrapiFormComponentSchema),
    // eslint-disable-next-line camelcase
    post_form: z.array(StrapiContentComponentSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiMetaSchema)
  .merge(HasStrapiSlugSchema)
  .merge(HasStrapiTimestampsSchema);
