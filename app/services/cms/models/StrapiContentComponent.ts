import { z } from "zod";
import { StrapiHeadingComponentSchema } from "./StrapiHeading";
import { StrapiBoxWithImageComponentSchema } from "./StrapiBoxWithImage";
import { StrapiParagraphComponentSchema } from "./StrapiParagraph";
import { StrapiInfoBoxComponentSchema } from "./StrapiInfoBox";
import { StrapiBoxComponentSchema } from "./StrapiBox";
import { StrapiHeaderComponentSchema } from "./StrapiHeader";
import { StrapiInfoBoxItemComponentSchema } from "./StrapiInfoBoxItem";
import { StrapiLinkListBoxComponentSchema } from "./StrapiLinkListBox";
import { StrapiListComponentSchema } from "./StrapiList";
import { StrapiArraySummaryComponentSchema } from "./StrapiArraySummary";
import { StrapiInlineNoticeComponentSchema } from "../components/StrapiInlineNotice";

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
    StrapiLinkListBoxComponentSchema,
    StrapiListComponentSchema,
    StrapiArraySummaryComponentSchema,
    StrapiInlineNoticeComponentSchema,
  ],
);

export type StrapiContentComponent = z.infer<
  typeof StrapiContentComponentSchema
>;
