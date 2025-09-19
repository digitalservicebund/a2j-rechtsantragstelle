import { z } from "zod";
import { StrapiContentComponentSchema } from "./formElements/StrapiContentComponent";
import { StrapiFormComponentSchema } from "./formElements/StrapiFormComponent";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { StrapiFlowIdSchema } from "./StrapiFlowId";
import { StringWithHtmlEntities } from "./StringWithHtmlEntities";
import { StrapiStringOptionalSchema } from "./StrapiStringOptional";

export const StrapiFormFlowPageSchema = z.object({
  heading: StringWithHtmlEntities,
  stepId: z.string(),
  flow_ids: z.array(StrapiFlowIdSchema),
  preHeading: StrapiStringOptionalSchema,
  nextButtonLabel: StrapiStringOptionalSchema,
  backButtonLabel: StrapiStringOptionalSchema,
  pre_form: z.array(StrapiContentComponentSchema),
  form: z.array(StrapiFormComponentSchema),
  post_form: z.array(StrapiContentComponentSchema),
  ...HasStrapiLocaleSchema.shape,
  ...HasStrapiMetaSchema.shape,
});

export type StrapiFormFlowPage = z.infer<typeof StrapiFormFlowPageSchema>;
export type StrapiFormFlowPageInput = z.input<typeof StrapiFormFlowPageSchema>;
