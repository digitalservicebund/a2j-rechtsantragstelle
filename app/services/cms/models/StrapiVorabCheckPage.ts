import { z } from "zod";
import { StrapiContentComponentSchema } from "./formElements/StrapiContentComponent";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { StrapiFlowIdSchema } from "./StrapiFlowId";
import { StrapiFormComponentSchema } from "./StrapiFormComponent";

export const StrapiVorabCheckPageSchema = z.object({
  stepId: z.string(),
  flow_ids: z.array(StrapiFlowIdSchema),
  pre_form: z.array(StrapiContentComponentSchema),
  form: z.array(StrapiFormComponentSchema),
  nextButtonLabel: z.string().nullable(),
  ...HasStrapiLocaleSchema.shape,
  ...HasStrapiMetaSchema.shape,
});
