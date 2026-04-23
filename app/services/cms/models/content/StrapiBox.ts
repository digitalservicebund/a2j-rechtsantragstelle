import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { StrapiHeadingOptionalSchema } from "../content/StrapiHeading";
import { StrapiParagraphSchema } from "../content/StrapiParagraph";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "../HasStrapiLinkIdentifier";
import { StrapiButtonSchema } from "../StrapiButton";
import { StrapiImageOptionalSchema } from "../StrapiImage";
import { StrapiBoxItemSchema } from "./StrapiBoxItem";
import { StrapiPaddingOptionalSchema } from "../StrapiPadding";
import { type Variant, variantWidths } from "~/components/content/BoxWithImage";
import { StrapiBackgroundColorOptionalSchema } from "../StrapiBackgroundColor";

// Necessary destructuring for zod enum type
const [firstWidth, ...widths] = Object.keys(variantWidths).map(
  (key) => key as Variant,
);

export const StrapiBoxSchema = z.object({
  label: StrapiHeadingOptionalSchema,
  heading: StrapiHeadingOptionalSchema,
  subline: StrapiHeadingOptionalSchema,
  content: StrapiParagraphSchema.nullable().transform(omitNull),
  contentBackgroundColor: StrapiBackgroundColorOptionalSchema,
  paddingTop: StrapiPaddingOptionalSchema,
  paddingBottom: StrapiPaddingOptionalSchema,
  sectionBackgroundColor: StrapiBackgroundColorOptionalSchema,
  buttons: z.array(StrapiButtonSchema).nullable().transform(omitNull),
  image: StrapiImageOptionalSchema,
  variant: z
    .enum([firstWidth, ...widths])
    .optional()
    .nullable()
    .transform(omitNull),
  items: z.array(StrapiBoxItemSchema).nullable().transform(omitNull).optional(),
  __component: z.literal("page.box"),
  ...HasStrapiIdSchema.shape,
  ...OptionalStrapiLinkIdentifierSchema.shape,
});
