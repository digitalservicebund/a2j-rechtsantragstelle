import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasIdSchema } from "./HasId";
import { HeadingSchema } from "./Heading";
import { ParagraphSchema } from "./Paragraph";

export const StrapiBoxSchema = z
  .object({
    __component: z.literal("page.box").optional(),
    label: HeadingSchema.nullable(),
    heading: HeadingSchema.nullable(),
    content: ParagraphSchema.optional(),
    button: StrapiButtonSchema.nullable(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasIdSchema)
  .strict();

export type StrapiBox = z.infer<typeof StrapiBoxSchema>;
