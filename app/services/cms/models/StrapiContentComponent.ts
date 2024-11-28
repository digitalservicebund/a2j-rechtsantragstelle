import { z } from "zod";
import { StrapiVideoComponentSchema } from "~/services/cms/models/StrapiVideo";
import { StrapiArraySummaryComponentSchema } from "./StrapiArraySummary";
import { StrapiBoxComponentSchema } from "./StrapiBox";
import { StrapiBoxWithImageComponentSchema } from "./StrapiBoxWithImage";
import { StrapiDetailsComponentSchema } from "./StrapiDetails";
import { StrapiHeaderComponentSchema } from "./StrapiHeader";
import { StrapiHeadingComponentSchema } from "./StrapiHeading";
import { StrapiInfoBoxComponentSchema } from "./StrapiInfoBox";
import { StrapiInlineNoticeComponentSchema } from "./StrapiInlineNotice";
import { StrapiLinkListBoxComponentSchema } from "./StrapiLinkListBox";
import { StrapiListComponentSchema } from "./StrapiList";
import { StrapiParagraphComponentSchema } from "./StrapiParagraph";
import { StrapiUserFeedbackComponentSchema } from "./StrapiUserFeedback";

export const StrapiContentComponentSchema = z.discriminatedUnion(
  "__component",
  [
    StrapiBoxComponentSchema,
    StrapiBoxWithImageComponentSchema,
    StrapiHeaderComponentSchema,
    StrapiHeadingComponentSchema,
    StrapiInfoBoxComponentSchema,
    StrapiParagraphComponentSchema,
    StrapiVideoComponentSchema,
    StrapiLinkListBoxComponentSchema,
    StrapiListComponentSchema,
    StrapiArraySummaryComponentSchema,
    StrapiInlineNoticeComponentSchema,
    StrapiDetailsComponentSchema,
    StrapiUserFeedbackComponentSchema,
  ],
);

export type StrapiContentComponent = z.infer<
  typeof StrapiContentComponentSchema
>;
