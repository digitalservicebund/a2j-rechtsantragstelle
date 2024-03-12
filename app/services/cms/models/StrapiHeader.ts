import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema, getRichTextProps } from "./StrapiParagraph";
import { HeaderPropsSchema } from "~/components/Header";
import { omitNull } from "~/util/omitNull";
import type { StrapiContent } from "./StrapiContent";

export const StrapiHeaderSchema = z
  .object({
    __component: z.literal("page.header"),
    heading: StrapiHeadingSchema,
    content: StrapiParagraphSchema.nullable(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

export type StrapiHeader = z.infer<typeof StrapiHeaderSchema>;

export const getHeaderProps = (cmsData: StrapiHeader) => {
  const content = cmsData.content && getRichTextProps(cmsData.content);
  return HeaderPropsSchema.parse(omitNull({ ...cmsData, content }));
};

export const isStrapiHeader = (
  content: StrapiContent,
): content is StrapiHeader => content.__component === "page.header";
