import { z } from "zod";
import { StrapiHeadingSchema } from "./content/StrapiHeading";
import { StrapiParagraphSchema } from "./content/StrapiParagraph";
import { StrapiContentComponentSchema } from "./formElements/StrapiContentComponent";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiMetaSchema } from "./HasStrapiMeta";
import { StrapiElementWithIdSchema } from "./StrapiElementWithId";
import { StrapiFlowIdSchema } from "./StrapiFlowId";
import { StrapiLinkSchema } from "./StrapiLink";
import { StrapiStringOptionalSchema } from "./StrapiStringOptional";
import { omitNull } from "~/util/omitNull";

export const StrapiResultPageSchema = z.object({
  stepId: z.string(),
  flow_ids: z.array(StrapiFlowIdSchema),
  pageType: z.enum(["error", "success", "warning", "info"]),
  heading: StrapiHeadingSchema,
  hintText: StrapiParagraphSchema.nullable().transform(omitNull).optional(),
  documents: StrapiElementWithIdSchema.nullable()
    .transform(omitNull)
    .optional(),
  nextSteps: StrapiElementWithIdSchema.nullable()
    .transform(omitNull)
    .optional(),
  freeZone: z.array(StrapiContentComponentSchema),
  nextLink: StrapiLinkSchema.nullable().transform(omitNull).optional(),
  backButtonLabel: StrapiStringOptionalSchema,
  ...HasStrapiLocaleSchema.shape,
  ...HasStrapiMetaSchema.shape,
});
