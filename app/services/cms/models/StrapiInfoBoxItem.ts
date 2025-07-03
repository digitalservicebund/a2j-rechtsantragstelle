import { z } from "zod";
import { StrapiHeadingOptionalSchema } from "~/services/cms/models/StrapiHeading";
import { StrapiInlineNoticeSchema } from "~/services/cms/models/StrapiInlineNotice";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiAccordionSchema } from "./StrapiAccordion";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiDetailsSchema } from "./StrapiDetails";
import { StrapiImageOptionalSchema } from "./StrapiImage";

export const StrapiInfoBoxItemSchema = z
  .object({
    label: StrapiHeadingOptionalSchema,
    headline: StrapiHeadingOptionalSchema,
    image: StrapiImageOptionalSchema,
    content: StrapiRichTextOptionalSchema(),
    detailsSummary: z.array(StrapiDetailsSchema),
    inlineNotice: z.array(StrapiInlineNoticeSchema),
    buttons: z.array(StrapiButtonSchema),
    accordion: StrapiAccordionSchema.nullable().transform(omitNull).optional(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema)
  .transform((cmsData) => ({
    ...cmsData,
    details: cmsData.detailsSummary,
    inlineNotices: cmsData.inlineNotice,
  }));
