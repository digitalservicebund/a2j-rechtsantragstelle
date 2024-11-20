import { z } from "zod";
import { StrapiVideoComponentSchema } from "~/services/cms/models/StrapiVideo";
import { StrapiArraySummaryComponentSchema } from "./StrapiArraySummary";
import { StrapiBoxComponentSchema } from "./StrapiBox";
import { StrapiBoxWithImageComponentSchema } from "./StrapiBoxWithImage";
import { StrapiHeaderComponentSchema } from "./StrapiHeader";
import { StrapiHeadingComponentSchema } from "./StrapiHeading";
import { StrapiInfoBoxComponentSchema } from "./StrapiInfoBox";
import { StrapiInfoBoxItemComponentSchema } from "./StrapiInfoBoxItem";
import { StrapiLinkListBoxComponentSchema } from "./StrapiLinkListBox";
import { StrapiListComponentSchema } from "./StrapiList";
import { StrapiParagraphComponentSchema } from "./StrapiParagraph";
import { StrapiDetailsSummaryComponentSchema } from "../components/StrapiDetailsSummary";
import { StrapiInlineNoticeComponentSchema } from "../components/StrapiInlineNotice";
import { StrapiUserFeedbackComponentSchema } from "../components/StrapiUserFeedback";
export const StrapiContentComponentSchema = z.discriminatedUnion(
  "__component",
  [
    StrapiBoxComponentSchema,
    StrapiBoxWithImageComponentSchema,
    StrapiHeaderComponentSchema,
    StrapiHeadingComponentSchema,
    StrapiInfoBoxComponentSchema,
    StrapiInfoBoxItemComponentSchema,
    StrapiParagraphComponentSchema,
    StrapiVideoComponentSchema,
    StrapiLinkListBoxComponentSchema,
    StrapiListComponentSchema,
    StrapiArraySummaryComponentSchema,
    StrapiInlineNoticeComponentSchema,
    StrapiDetailsSummaryComponentSchema,
    StrapiUserFeedbackComponentSchema,
  ],
);

export type StrapiContentComponent = z.infer<
  typeof StrapiContentComponentSchema
>;
