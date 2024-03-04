import { z } from "zod";
import { StrapiHeadingComponentSchema } from "./StrapiHeading";
import { StrapiBoxWithImageSchema } from "./StrapiBoxWithImage";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { StrapiInfoBoxSchema } from "./StrapiInfoBox";
import { StrapiBoxSchema } from "./StrapiBox";
import { StrapiHeaderSchema } from "./StrapiHeader";
import { StrapiInputComponentSchema } from "./StrapiInput";
import { StrapiInfoBoxItemSchema } from "./StrapiInfoBoxItem";
import { StrapiSelectComponentSchema } from "./StrapiSelect";
import { StrapiLinkListBoxSchema } from "./StrapiLinkListBox";
import { StrapiDropdownComponentSchema } from "./StrapiDropdown";
import { StrapiTextareaComponentSchema } from "./StrapiTextarea";
import { StrapiListSchema } from "./StrapiList";
import { StrapiListItemSchema } from "./StrapiListItem";
import { StrapiCheckboxComponentSchema } from "./StrapiCheckbox";
import { StrapiTileGroupComponentSchema } from "./StrapiTileGroup";
import { StrapiDateInputComponentSchema } from "~/services/cms/models/StrapiDateInput";
import { StrapiTimeInputComponentSchema } from "~/services/cms/models/StrapiTimeInput";
import { StrapiFileInputComponentSchema } from "~/services/cms/models/StrapiFileInput";
import { StrapiAlertSchema } from "./StrapiAlert";
import { StrapiArraySummarySchema } from "./StrapiArraySummary";

// TODO: re-use StrapiFormComponentSchema?
export const StrapiContentSchema = z.discriminatedUnion("__component", [
  StrapiBoxSchema.required({ __component: true }),
  StrapiBoxWithImageSchema.required({ __component: true }),
  StrapiHeaderSchema.required({ __component: true }),
  StrapiCheckboxComponentSchema,
  StrapiHeadingComponentSchema,
  StrapiInfoBoxSchema.required({ __component: true }),
  StrapiInfoBoxItemSchema.required({ __component: true }),
  StrapiParagraphSchema.required({ __component: true }),
  StrapiInputComponentSchema,
  StrapiTextareaComponentSchema,
  StrapiSelectComponentSchema,
  StrapiLinkListBoxSchema.required({ __component: true }),
  StrapiDropdownComponentSchema,
  StrapiListSchema.required({ __component: true }),
  StrapiListItemSchema.required({ __component: true }),
  StrapiTileGroupComponentSchema,
  StrapiDateInputComponentSchema,
  StrapiTimeInputComponentSchema,
  StrapiFileInputComponentSchema,
  StrapiAlertSchema.required({ __component: true }),
  StrapiArraySummarySchema.required({ __component: true }),
]);

export type StrapiContent = z.infer<typeof StrapiContentSchema>;
