import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { StrapiContentComponentSchema } from "./StrapiContentComponent";
import { StrapiFlowIdSchema } from "./StrapiFlowId";
import { StrapiFormComponentSchema } from "./StrapiFormComponent";

export const StrapiFormFlowPageSchema = z
  .object({
    heading: z.string(),
    stepId: z.string().nullable(),
    flow_ids: z.object({
      data: z.array(z.object({ attributes: StrapiFlowIdSchema })),
    }),
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
  .merge(HasStrapiTimestampsSchema);
