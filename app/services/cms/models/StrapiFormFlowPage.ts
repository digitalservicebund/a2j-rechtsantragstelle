import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
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
    backButtonLabel: z.string().nullable(),

    pre_form: z.array(StrapiContentComponentSchema),
    form: z.array(StrapiFormComponentSchema),

    post_form: z.array(StrapiContentComponentSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiMetaSchema);

export type StrapiFormFlowPage = z.infer<typeof StrapiFormFlowPageSchema>;
