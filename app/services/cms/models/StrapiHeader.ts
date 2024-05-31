import { z } from "zod";
import { HeaderPropsSchema } from "~/components/Header";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import type { StrapiContentComponent } from "./StrapiContentComponent";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema, getRichTextProps } from "./StrapiParagraph";

const StrapiHeaderSchema = z
  .object({
    heading: StrapiHeadingSchema,
    content: StrapiParagraphSchema.nullable(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiHeader = z.infer<typeof StrapiHeaderSchema>;

export const StrapiHeaderComponentSchema = StrapiHeaderSchema.extend({
  __component: z.literal("page.header"),
});

type StrapiHeaderComponent = z.infer<typeof StrapiHeaderComponentSchema>;

export const getHeaderProps = (cmsData: StrapiHeader) => {
  const content = cmsData.content && getRichTextProps(cmsData.content);
  return HeaderPropsSchema.parse(omitNull({ ...cmsData, content }));
};

export const isStrapiHeader = (
  content: StrapiContentComponent,
): content is StrapiHeaderComponent => content.__component === "page.header";
