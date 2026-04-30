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
import { StrapiBackgroundColorOptionalSchema } from "../StrapiBackgroundColor";

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
  items: z.array(StrapiBoxItemSchema).nullable().transform(omitNull).optional(),
  __component: z.literal("page.box"),
  ...HasStrapiIdSchema.shape,
  ...OptionalStrapiLinkIdentifierSchema.shape,
});
