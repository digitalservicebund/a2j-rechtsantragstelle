import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import type { StrapiContentComponent } from "./StrapiContentComponent";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { getRichTextProps, StrapiParagraphSchema } from "./StrapiParagraph";

export const StrapiHeaderSchema = z
  .object({
    heading: StrapiHeadingSchema,
    content: StrapiParagraphSchema,
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    __component: "page.header" as const,
    ...cmsData,
    content: cmsData.content && getRichTextProps(cmsData.content),
  }));

type StrapiHeaderComponent = z.infer<typeof StrapiHeaderSchema>;

export const isStrapiHeader = (
  content: StrapiContentComponent,
): content is StrapiHeaderComponent => content.__component === "page.header";
