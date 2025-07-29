import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { StrapiContentComponentSchema } from "./StrapiContentComponent";
import { StrapiElementWithIdSchema } from "./StrapiElementWithId";
import { StrapiFlowIdSchema } from "./StrapiFlowId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiLinkSchema } from "./StrapiLink";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { StrapiResultPageTypeSchema } from "./StrapiResultPageType";

export const StrapiResultPageSchema = z.object({
  stepId: z.string(),
  flow_ids: z.array(StrapiFlowIdSchema),
  pageType: StrapiResultPageTypeSchema,
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
