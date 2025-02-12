import { z } from "zod";
import { StrapiVideoSchema } from "~/services/cms/models/StrapiVideo";
import { StrapiArraySummaryComponentSchema } from "./StrapiArraySummary";
import { StrapiBoxComponentSchema } from "./StrapiBox";
import { StrapiBoxWithImageSchema } from "./StrapiBoxWithImage";
import { StrapiDetailsSchema } from "./StrapiDetails";
import { StrapiHeaderSchema } from "./StrapiHeader";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiInfoBoxSchema } from "./StrapiInfoBox";
import { StrapiInlineNoticeSchema } from "./StrapiInlineNotice";
import { StrapiLinkListBoxSchema } from "./StrapiLinkListBox";
import { StrapiListSchema } from "./StrapiList";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { StrapiUserFeedbackSchema } from "./StrapiUserFeedback";

export const StrapiContentComponentSchema = z.union([
  StrapiBoxComponentSchema,
  StrapiBoxWithImageSchema,
  StrapiHeaderSchema,
  StrapiHeadingSchema,
  StrapiInfoBoxSchema,
  StrapiParagraphSchema,
  StrapiVideoSchema,
  StrapiLinkListBoxSchema,
  StrapiListSchema,
  StrapiArraySummaryComponentSchema,
  StrapiInlineNoticeSchema,
  StrapiDetailsSchema,
  StrapiUserFeedbackSchema,
]);

export type StrapiContentComponent = z.infer<
  typeof StrapiContentComponentSchema
>;
