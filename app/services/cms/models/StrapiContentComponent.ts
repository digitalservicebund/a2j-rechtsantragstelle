import { z } from "zod";
import { StrapiEmailCaptureSchema } from "~/services/cms/models/content/StrapiEmailCapture";
import { StrapiVideoSchema } from "~/services/cms/models/content/StrapiVideo";
import { StrapiArraySummaryComponentSchema } from "./content/StrapiArraySummary";
import { StrapiBoxSchema } from "./content/StrapiBox";
import { StrapiBoxWithImageSchema } from "./content/StrapiBoxWithImage";
import { StrapiDetailsSchema } from "./content/StrapiDetails";
import { StrapiHeadingSchema } from "./content/StrapiHeading";
import { StrapiHeroSchema } from "./content/StrapiHero";
import { StrapiInfoBoxSchema } from "./content/StrapiInfoBox";
import { StrapiInlineNoticeSchema } from "./content/StrapiInlineNotice";
import { StrapiListSchema } from "./content/StrapiList";
import { StrapiParagraphSchema } from "./content/StrapiParagraph";
import { StrapiSummaryOverviewSectionSchema } from "./content/StrapiSummaryOverviewSection";
import { StrapiTableOfContentsSchema } from "./content/StrapiTableOfContents";
import { StrapiUserFeedbackSchema } from "./content/StrapiUserFeedback";

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
