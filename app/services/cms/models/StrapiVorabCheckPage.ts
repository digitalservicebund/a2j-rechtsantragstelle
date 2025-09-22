import { z } from "zod";
import { StrapiContentComponentSchema } from "./formElements/StrapiContentComponent";
import { StrapiFormComponentSchema } from "./formElements/StrapiFormComponent";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { StrapiFlowIdSchema } from "./StrapiFlowId";
import { StrapiStringOptionalSchema } from "./StrapiStringOptional";

export const StrapiVorabCheckPageSchema = z.object({
  stepId: z.string(),
  flow_ids: z.array(StrapiFlowIdSchema),
  pre_form: z.array(StrapiContentComponentSchema),
  form: z.array(StrapiFormComponentSchema),
  nextButtonLabel: StrapiStringOptionalSchema,
  ...HasStrapiLocaleSchema.shape,
  ...HasStrapiMetaSchema.shape,
});
