import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { StrapiContentComponentSchema } from "./StrapiContentComponent";
import { StrapiFlowIdSchema } from "./StrapiFlowId";
import { StrapiFormComponentSchema } from "./StrapiFormComponent";
import { StringWithHtmlEntities } from "./StringWithHtmlEntities";

export const StrapiFormFlowPageSchema = z.object({
  heading: StringWithHtmlEntities,
  stepId: z.string(),
  flow_ids: z.array(StrapiFlowIdSchema),
  preHeading: z.string().nullable(),
  nextButtonLabel: z.string().nullable(),
  backButtonLabel: z.string().nullable(),
  pre_form: z.array(StrapiContentComponentSchema),
  form: z.array(StrapiFormComponentSchema),
  post_form: z.array(StrapiContentComponentSchema),
  ...HasStrapiLocaleSchema.shape,
  ...HasStrapiMetaSchema.shape,
});

export type StrapiFormFlowPage = z.infer<typeof StrapiFormFlowPageSchema>;
export type StrapiFormFlowPageInput = z.input<typeof StrapiFormFlowPageSchema>;
