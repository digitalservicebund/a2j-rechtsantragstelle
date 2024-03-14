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
import { StrapiAlertComponentSchema } from "./StrapiAlert";
import { StrapiArraySummaryComponentSchema } from "./StrapiArraySummary";

export const StrapiContentSchema = z.discriminatedUnion("__component", [
  StrapiBoxComponentSchema,
  StrapiBoxWithImageComponentSchema,
  StrapiHeaderComponentSchema,
  StrapiHeadingComponentSchema,
  StrapiInfoBoxComponentSchema,
  StrapiInfoBoxItemComponentSchema,
  StrapiParagraphComponentSchema,
  StrapiLinkListBoxComponentSchema,
  StrapiListComponentSchema,
  StrapiAlertComponentSchema,
  StrapiArraySummaryComponentSchema,
]);

export type StrapiContent = z.infer<typeof StrapiContentSchema>;
