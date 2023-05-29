import { z } from "zod";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { StrapiInfoBoxSchema } from "./StrapiInfoBox";
import { StrapiBoxSchema } from "./StrapiBox";
import { StrapiHeaderSchema } from "./StrapiHeader";

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
  StrapiParagraphSchema.merge(
    z.object({
      __component: z.literal("basic.paragraph"),
    })
  ),
]);

export type StrapiContent = z.infer<typeof StrapiContentSchema>;
