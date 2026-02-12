import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { StrapiHeadingOptionalSchema } from "../content/StrapiHeading";
import { StrapiParagraphSchema } from "../content/StrapiParagraph";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "../HasStrapiLinkIdentifier";
import { StrapiButtonSchema } from "../StrapiButton";
import { StrapiImageOptionalSchema } from "../StrapiImage";
import { StrapiBoxItemSchema } from "./StrapiBoxItem";
import { StrapiKernBackgroundColorOptionalSchema } from "../StrapiBackgroundColor";
import { StrapiPaddingOptionalSchema } from "../StrapiPadding";
import { StrapiBackgroundOptionalSchema } from "../StrapiBackground";
import { StrapiContainerSchema } from "../StrapiContainer";

export const StrapiBoxSchema = z.object({
  label: StrapiHeadingOptionalSchema,
  heading: StrapiHeadingOptionalSchema,
  content: StrapiParagraphSchema.nullable().transform(omitNull),
  outerBackground: StrapiBackgroundOptionalSchema, // To be removed after KERN migration
  container: StrapiContainerSchema.nullable().transform(omitNull).optional(), // To be removed after KERN migration
  contentBackgroundColor: StrapiKernBackgroundColorOptionalSchema,
  paddingTop: StrapiPaddingOptionalSchema,
  paddingBottom: StrapiPaddingOptionalSchema,
  sectionBackgroundColor: StrapiKernBackgroundColorOptionalSchema,
  buttons: z.array(StrapiButtonSchema).nullable().transform(omitNull),
  image: StrapiImageOptionalSchema,
  items: z.array(StrapiBoxItemSchema).nullable().transform(omitNull).optional(),
  __component: z.literal("page.box"),
  ...HasStrapiIdSchema.shape,
  ...OptionalStrapiLinkIdentifierSchema.shape,
});
