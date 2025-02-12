import { z } from "zod";
import { StrapiVideoSchema } from "~/services/cms/models/StrapiVideo";
import { StrapiArraySummaryComponentSchema } from "./StrapiArraySummary";
import { StrapiBoxComponentSchema } from "./StrapiBox";
import { StrapiBoxWithImageSchema } from "./StrapiBoxWithImage";
import { StrapiDetailsSchema } from "./StrapiDetails";
import { StrapiHeaderComponentSchema } from "./StrapiHeader";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiInfoBoxSchema } from "./StrapiInfoBox";
import { StrapiInlineNoticeSchema } from "./StrapiInlineNotice";
import { StrapiLinkListBoxSchema } from "./StrapiLinkListBox";
import { StrapiListSchema } from "./StrapiList";
import { StrapiParagraphComponentSchema } from "./StrapiParagraph";
import { StrapiSummaryOverviewSchema } from "./StrapiSummaryOverview";
import { StrapiUserFeedbackSchema } from "./StrapiUserFeedback";

export const StrapiContentComponentSchema = z.union([
  StrapiBoxComponentSchema,
  StrapiBoxWithImageSchema,
  StrapiHeaderComponentSchema,
  StrapiHeadingSchema,
  StrapiInfoBoxSchema,
  StrapiParagraphComponentSchema,
  StrapiVideoSchema,
  StrapiLinkListBoxSchema,
  StrapiListSchema,
  StrapiArraySummaryComponentSchema,
  StrapiInlineNoticeSchema,
  StrapiDetailsSchema,
  StrapiUserFeedbackSchema,
  StrapiSummaryOverviewSchema,
]);

export type StrapiContentComponent = z.infer<
  typeof StrapiContentComponentSchema
>;
