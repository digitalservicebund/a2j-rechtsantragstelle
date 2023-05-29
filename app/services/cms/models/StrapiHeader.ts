import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";

export const StrapiHeaderSchema = z
  .object({
    __component: z.literal("page.header").optional(),
    heading: StrapiHeadingSchema,
    content: StrapiParagraphSchema,
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasStrapiIdSchema)
  .strict();

export type StrapiHeader = z.infer<typeof StrapiHeaderSchema>;
