import { z } from "zod";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { StrapiInfoBoxSchema } from "./StrapiInfoBox";
import { StrapiBoxSchema } from "./StrapiBox";
import { StrapiHeaderSchema } from "./StrapiHeader";
import { StrapiInputSchema } from "./StrapiInput";
import { StrapiInfoBoxItemSchema } from "~/services/cms/models/StrapiInfoBoxItem";
import { StrapiSelectSchema } from "~/services/cms/models/StrapiSelect";

export const StrapiContentSchema = z.discriminatedUnion("__component", [
  StrapiBoxSchema.merge(
    z.object({
      __component: z.literal("page.box"),
    })
  ),
  StrapiHeaderSchema.merge(
    z.object({
      __component: z.literal("page.header"),
    })
  ),
  StrapiHeadingSchema.merge(
    z.object({
      __component: z.literal("basic.heading"),
    })
  ),
  StrapiInfoBoxSchema.merge(
    z.object({
      __component: z.literal("page.info-box"),
    })
  ),
  StrapiInfoBoxItemSchema.merge(
    z.object({
      __component: z.literal("page.info-box-item"),
    })
  ),
  StrapiParagraphSchema.merge(
    z.object({
      __component: z.literal("basic.paragraph"),
    })
  ),
  StrapiInputSchema.merge(
    z.object({
      __component: z.literal("form-elements.input"),
    })
  ),
  StrapiSelectSchema.merge(
    z.object({
      __component: z.literal("form-elements.select"),
    })
  ),
]);

export type StrapiContent = z.infer<typeof StrapiContentSchema>;
