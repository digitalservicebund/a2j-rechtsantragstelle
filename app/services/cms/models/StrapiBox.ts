import pick from "lodash/pick";
import { z } from "zod";
import type { BoxProps } from "~/components/Box";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema, getRichTextProps } from "./StrapiParagraph";

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

export const getBoxProps = (cmsData: StrapiBox): BoxProps => {
  return omitNull({
    ...pick(cmsData, "label", "heading", "buttons", "identifier"),
    content: cmsData.content && getRichTextProps(cmsData.content),
  });
};
