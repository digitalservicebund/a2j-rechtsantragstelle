import { z } from "zod";
import { StrapiContentComponentSchema } from "./formElements/StrapiContentComponent";
import { StrapiFormComponentSchema } from "./formElements/StrapiFormComponent";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StrapiFlowIdSchema } from "./StrapiFlowId";
import { StrapiStringOptionalSchema } from "./StrapiStringOptional";

export const StrapiVorabCheckPageSchema = z.object({
  stepId: z.string(),
  flow_ids: z.array(StrapiFlowIdSchema),
  pageTitle: z.string(),
  pre_form: z.array(StrapiContentComponentSchema),
  form: z.array(StrapiFormComponentSchema),
  nextButtonLabel: StrapiStringOptionalSchema,
  ...HasStrapiLocaleSchema.shape,
});
