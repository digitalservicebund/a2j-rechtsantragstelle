import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { ButtonSchema } from "./Button";
import { ContainerSchema } from "./Container";
import { HasIdSchema } from "./HasId";
import { HeadingSchema } from "./Heading";
import { ParagraphSchema } from "./Paragraph";

export const BoxSchema = z
  .object({
    __component: z.literal("page.box").optional(),
    label: HeadingSchema.nullable(),
    heading: HeadingSchema.nullable(),
    content: ParagraphSchema.optional(),
    button: ButtonSchema.nullable(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: ContainerSchema,
  })
  .merge(HasIdSchema)
  .strict();

export type Box = z.infer<typeof BoxSchema>;
