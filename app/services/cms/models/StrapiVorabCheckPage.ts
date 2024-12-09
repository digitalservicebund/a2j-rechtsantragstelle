import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { StrapiContentComponentSchema } from "./StrapiContentComponent";
import { StrapiFlowIdSchema } from "./StrapiFlowId";
import { StrapiFormComponentSchema } from "./StrapiFormComponent";

export const StrapiVorabCheckPageSchema = z
  .object({
    stepId: z.string().nullable(),
    flow_ids: z.object({
      data: z.array(z.object({ attributes: StrapiFlowIdSchema })),
    }),

    pre_form: z.array(StrapiContentComponentSchema),
    form: z.array(StrapiFormComponentSchema),
    nextButtonLabel: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiMetaSchema);
