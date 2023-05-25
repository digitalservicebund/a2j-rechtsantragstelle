import { z } from "zod";
import { BackgroundSchema } from "./Background";
import { ContainerSchema } from "./Container";
import { HeadingSchema } from "./Heading";
import { ParagraphSchema } from "./Paragraph";

export const HeaderSchema = z.object({
  id: z.number(),
  __component: z.literal("page.header").optional(),
  heading: HeadingSchema,
  content: ParagraphSchema,
  outerBackground: BackgroundSchema.nullable(),
  container: ContainerSchema,
});

export type Header = z.infer<typeof HeaderSchema>;
