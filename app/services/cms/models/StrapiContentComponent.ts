import { z } from "zod";
import { StrapiEmailCaptureSchema } from "~/services/cms/models/StrapiEmailCapture";
import { StrapiVideoSchema } from "~/services/cms/models/StrapiVideo";
import { StrapiArraySummaryComponentSchema } from "./StrapiArraySummary";
import { StrapiBoxSchema } from "./StrapiBox";
import { StrapiBoxWithImageSchema } from "./StrapiBoxWithImage";
import { StrapiDetailsSchema } from "./StrapiDetails";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiHeroSchema } from "./StrapiHero";
import { StrapiInfoBoxSchema } from "./StrapiInfoBox";
import { StrapiInlineNoticeSchema } from "./StrapiInlineNotice";
import { StrapiListSchema } from "./StrapiList";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { StrapiSummaryOverviewSectionSchema } from "./StrapiSummaryOverviewSection";
import { StrapiTableOfContentsSchema } from "./StrapiTableOfContents";
import { StrapiUserFeedbackSchema } from "./StrapiUserFeedback";

export const StrapiContentComponentSchema = z.union([
  StrapiBoxSchema,
  StrapiBoxWithImageSchema,
  StrapiHeroSchema,
  StrapiHeadingSchema,
  StrapiInfoBoxSchema,
  StrapiParagraphSchema,
  StrapiVideoSchema,
  StrapiTableOfContentsSchema,
  StrapiListSchema,
  StrapiArraySummaryComponentSchema,
  StrapiInlineNoticeSchema,
  StrapiDetailsSchema,
  StrapiUserFeedbackSchema,
  StrapiSummaryOverviewSectionSchema,
  StrapiEmailCaptureSchema,
]);

export type StrapiContentComponent = z.infer<
  typeof StrapiContentComponentSchema
>;
