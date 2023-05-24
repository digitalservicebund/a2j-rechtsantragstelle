import { z } from "zod";
import { BackgroundSchema } from "./Background";
import { ButtonSchema } from "./Button";
import { ContainerSchema } from "./Container";
import { HeadingSchema } from "./Heading";
import { ParagraphSchema } from "./Paragraph";

export const BoxSchema = z.object({
  id: z.number(),
  __component: z.literal("page.box"),
  label: HeadingSchema.optional(),
  heading: HeadingSchema.optional(),
  content: ParagraphSchema.optional(),
  button: ButtonSchema.optional(),
  outerBackground: BackgroundSchema.optional(),
  container: ContainerSchema,
});

export type Box = z.infer<typeof BoxSchema>;
