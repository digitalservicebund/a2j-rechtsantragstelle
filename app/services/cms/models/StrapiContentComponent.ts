import { z } from "zod";
import { StrapiBoxWithImageSchema } from "./StrapiBoxWithImage";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { StrapiInfoBoxSchema } from "./StrapiInfoBox";
import { StrapiBoxSchema } from "./StrapiBox";
import { StrapiHeaderSchema } from "./StrapiHeader";
import { StrapiInfoBoxItemSchema } from "./StrapiInfoBoxItem";
import { StrapiLinkListBoxSchema } from "./StrapiLinkListBox";
import { StrapiListSchema } from "./StrapiList";
import { StrapiListItemSchema } from "./StrapiListItem";
import { StrapiAlertSchema } from "./StrapiAlert";
import { StrapiArraySummarySchema } from "./StrapiArraySummary";
import { StrapiHeadingComponentSchema } from "./StrapiHeading";

export const StrapiContentComponentSchema = z.discriminatedUnion(
  "__component",
  [
    StrapiHeadingComponentSchema,
    StrapiBoxSchema.required({ __component: true }),
    StrapiBoxWithImageSchema.required({ __component: true }),
    StrapiHeaderSchema.required({ __component: true }),
    StrapiInfoBoxSchema.required({ __component: true }),
    StrapiInfoBoxItemSchema.required({ __component: true }),
    StrapiParagraphSchema.required({ __component: true }),
    StrapiLinkListBoxSchema.required({ __component: true }),
    StrapiListSchema.required({ __component: true }),
    StrapiListItemSchema.required({ __component: true }),
    StrapiAlertSchema.required({ __component: true }),
    StrapiArraySummarySchema.required({ __component: true }),
  ],
);

export type StrapiContentComponent = z.infer<
  typeof StrapiContentComponentSchema
>;
