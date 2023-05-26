import { z } from "zod";
import { BackgroundSchema } from "./Background";
import { ContainerSchema } from "./Container";
import { HasIdSchema } from "./HasId";
import { HeadingSchema } from "./Heading";
import { ParagraphSchema } from "./Paragraph";

export const HeaderSchema = z
  .object({
    __component: z.literal("page.header").optional(),
    heading: HeadingSchema,
    content: ParagraphSchema,
    outerBackground: BackgroundSchema.nullable(),
    container: ContainerSchema,
  })
  .merge(HasIdSchema)
  .strict();

export type Header = z.infer<typeof HeaderSchema>;
