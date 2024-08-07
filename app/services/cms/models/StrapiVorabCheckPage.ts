import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { StrapiContentComponentSchema } from "./StrapiContentComponent";
import { StrapiFlowIdSchema } from "./StrapiFlowId";
import { StrapiFormComponentSchema } from "./StrapiFormComponent";

export const StrapiVorabCheckPageSchema = z
  .object({
    stepId: z.string().nullable(),
    flow_ids: z.object({
      data: z.array(z.object({ attributes: StrapiFlowIdSchema })),
    }),
    // eslint-disable-next-line camelcase
    pre_form: z.array(StrapiContentComponentSchema),
    form: z.array(StrapiFormComponentSchema),
    nextButtonLabel: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiMetaSchema)
  .merge(HasStrapiTimestampsSchema);
