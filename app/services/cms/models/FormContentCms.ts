import { z } from "zod";
import { HeadingSchema } from "./Heading";
import { ParagraphSchema } from "./Paragraph";
import { InfoBoxSchema } from "./InfoBox";
import { BoxSchema } from "./Box";
import { HeaderSchema } from "./Header";

export const FormContentCmsSchema = z.discriminatedUnion("__component", [
  BoxSchema.merge(
    z.object({
      __component: z.literal("page.box"),
    })
  ),
  HeaderSchema.merge(
    z.object({
      __component: z.literal("page.header"),
    })
  ),
  HeadingSchema.merge(
    z.object({
      __component: z.literal("basic.heading"),
    })
  ),
  InfoBoxSchema.merge(
    z.object({
      __component: z.literal("page.info-box"),
    })
  ),
  ParagraphSchema.merge(
    z.object({
      __component: z.literal("basic.paragraph"),
    })
  ),
]);

export type FormContentCms = z.infer<typeof FormContentCmsSchema>;
