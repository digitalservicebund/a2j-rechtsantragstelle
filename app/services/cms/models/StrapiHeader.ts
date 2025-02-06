import { z } from "zod";
import type { HeaderProps } from "~/components/Header";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import type { StrapiContentComponent } from "./StrapiContentComponent";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";

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

export const getHeaderProps = ({
  content,
  heading,
}: StrapiHeader): HeaderProps => omitNull({ heading, content: content });

export const isStrapiHeader = (
  content: StrapiContentComponent,
): content is StrapiHeaderComponent => content.__component === "page.header";
