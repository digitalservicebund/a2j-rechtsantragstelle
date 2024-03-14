import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema, getRichTextProps } from "./StrapiParagraph";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { BoxPropsSchema } from "~/components/Box";
import { omitNull } from "~/util/omitNull";

const StrapiBoxSchema = z
  .object({
    label: StrapiHeadingSchema.nullable(),
    heading: StrapiHeadingSchema.nullable(),
    content: StrapiParagraphSchema.nullable(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
    buttons: z.array(StrapiButtonSchema).nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiBox = z.infer<typeof StrapiBoxSchema>;

export const StrapiBoxComponentSchema = StrapiBoxSchema.extend({
  __component: z.literal("page.box"),
});

export const getBoxProps = (cmsData: StrapiBox) => {
  const content = cmsData.content && getRichTextProps(cmsData.content);
  return BoxPropsSchema.parse(omitNull({ ...cmsData, content }));
};
