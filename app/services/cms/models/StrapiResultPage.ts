import { z } from "zod";
import { StrapiHeadingSchema } from "./content/StrapiHeading";
import { StrapiParagraphSchema } from "./content/StrapiParagraph";
import { StrapiContentComponentSchema } from "./formElements/StrapiContentComponent";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { StrapiElementWithIdSchema } from "./StrapiElementWithId";
import { StrapiFlowIdSchema } from "./StrapiFlowId";
import { StrapiLinkSchema } from "./StrapiLink";

export const StrapiResultPageSchema = z.object({
  stepId: z.string(),
  flow_ids: z.array(StrapiFlowIdSchema),
  pageType: z.enum(["error", "success", "warning", "info"]),
  heading: StrapiHeadingSchema,
  hintText: StrapiParagraphSchema.nullable(),
  documents: StrapiElementWithIdSchema.nullable(),
  nextSteps: StrapiElementWithIdSchema.nullable(),
  freeZone: z.array(StrapiContentComponentSchema),
  nextLink: StrapiLinkSchema.nullable(),
  backButtonLabel: z.string().nullable(),
  ...HasStrapiLocaleSchema.shape,
  ...HasStrapiMetaSchema.shape,
});
