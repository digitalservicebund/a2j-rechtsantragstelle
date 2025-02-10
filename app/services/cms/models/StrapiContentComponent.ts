import { z } from "zod";
import { StrapiVideoSchema } from "~/services/cms/models/StrapiVideo";
import { StrapiArraySummaryComponentSchema } from "./StrapiArraySummary";
import { StrapiBoxComponentSchema } from "./StrapiBox";
import { StrapiBoxWithImageComponentSchema } from "./StrapiBoxWithImage";
import { StrapiDetailsSchema } from "./StrapiDetails";
import { StrapiHeaderComponentSchema } from "./StrapiHeader";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiInfoBoxComponentSchema } from "./StrapiInfoBox";
import { StrapiInlineNoticeSchema } from "./StrapiInlineNotice";
import { StrapiLinkListBoxComponentSchema } from "./StrapiLinkListBox";
import { StrapiListComponentSchema } from "./StrapiList";
import { StrapiParagraphComponentSchema } from "./StrapiParagraph";
import { StrapiUserFeedbackComponentSchema } from "./StrapiUserFeedback";

export const StrapiContentComponentSchema = z.union([
  StrapiBoxComponentSchema,
  StrapiBoxWithImageComponentSchema,
  StrapiHeaderComponentSchema,
  StrapiHeadingSchema,
  StrapiInfoBoxComponentSchema,
  StrapiParagraphComponentSchema,
  StrapiVideoSchema,
  StrapiLinkListBoxComponentSchema,
  StrapiListComponentSchema,
  StrapiArraySummaryComponentSchema,
  StrapiInlineNoticeSchema,
  StrapiDetailsSchema,
  StrapiUserFeedbackComponentSchema,
]);

export type StrapiContentComponent = z.infer<
  typeof StrapiContentComponentSchema
>;
