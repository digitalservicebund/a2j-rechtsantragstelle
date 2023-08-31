import { z } from "zod";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiBoxWithImageSchema } from "./StrapiBoxWithImage";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { StrapiInfoBoxSchema } from "./StrapiInfoBox";
import { StrapiBoxSchema } from "./StrapiBox";
import { StrapiHeaderSchema } from "./StrapiHeader";
import { StrapiInputSchema } from "./StrapiInput";
import { StrapiInfoBoxItemSchema } from "./StrapiInfoBoxItem";
import { StrapiSelectSchema } from "./StrapiSelect";
import { StrapiLinkListBoxSchema } from "./StrapiLinkListBox";

export const StrapiContentSchema = z.discriminatedUnion("__component", [
  StrapiBoxSchema.required({ __component: true }),
  StrapiBoxWithImageSchema.required({ __component: true }),
  StrapiHeaderSchema.required({ __component: true }),
  StrapiHeadingSchema.required({ __component: true }),
  StrapiInfoBoxSchema.required({ __component: true }),
  StrapiInfoBoxItemSchema.required({ __component: true }),
  StrapiParagraphSchema.required({ __component: true }),
  StrapiInputSchema.required({ __component: true }),
  StrapiSelectSchema.required({ __component: true }),
  StrapiLinkListBoxSchema.required({ __component: true }),
]);

export type StrapiContent = z.infer<typeof StrapiContentSchema>;
