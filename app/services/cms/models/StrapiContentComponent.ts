import { z } from "zod";
import { StrapiVideoSchema } from "~/services/cms/models/StrapiVideo";
import { StrapiArraySummaryComponentSchema } from "./StrapiArraySummary";
import { StrapiBoxSchema } from "./StrapiBox";
import { StrapiBoxWithImageSchema } from "./StrapiBoxWithImage";
import { StrapiDetailsSchema } from "./StrapiDetails";
import { StrapiHeaderSchema } from "./StrapiHeader";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiInfoBoxSchema } from "./StrapiInfoBox";
import { StrapiInlineNoticeSchema } from "./StrapiInlineNotice";
import { StrapiLinkListBoxSchema } from "./StrapiLinkListBox";
import { StrapiListSchema } from "./StrapiList";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { StrapiSummaryOverviewSectionSchema } from "./StrapiSummaryOverviewSection";
import { StrapiUserFeedbackSchema } from "./StrapiUserFeedback";

export const StrapiContentComponentSchema = z.union([
  StrapiBoxSchema,
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
  StrapiSummaryOverviewSectionSchema,
]);

export type StrapiContentComponent = z.infer<
  typeof StrapiContentComponentSchema
>;
