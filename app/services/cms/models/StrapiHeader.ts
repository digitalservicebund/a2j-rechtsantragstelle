import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import type { StrapiContentComponent } from "./StrapiContentComponent";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";

export const StrapiHeaderSchema = z
  .object({
    heading: StrapiHeadingSchema,
    content: StrapiParagraphSchema.transform((content) => ({
      ...content,
      html: content.text,
    })),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
    __component: z.literal("page.header"),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiHeaderComponent = z.infer<typeof StrapiHeaderSchema>;

export const isStrapiHeader = (
  content: StrapiContentComponent,
): content is StrapiHeaderComponent => content.__component === "page.header";
