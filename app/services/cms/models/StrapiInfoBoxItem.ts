import { z } from "zod";
import { StrapiHeadingOptionalSchema } from "~/services/cms/models/StrapiHeading";
import { StrapiInlineNoticeSchema } from "~/services/cms/models/StrapiInlineNotice";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "./HasStrapiId";
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
    ...HasStrapiIdSchema.shape,
    ...OptionalStrapiLinkIdentifierSchema.shape,
  })
  .transform(({ detailsSummary, inlineNotice, ...cmsData }) => ({
    ...cmsData,
    details: detailsSummary,
    inlineNotices: inlineNotice,
  }));
