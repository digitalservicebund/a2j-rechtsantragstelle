import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundOptionalSchema } from "./StrapiBackground";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";

export const StrapiBoxSchema = z.object({
  label: StrapiHeadingOptionalSchema,
  heading: StrapiHeadingOptionalSchema,
  content: StrapiParagraphSchema.nullable().transform(omitNull).optional(),
  outerBackground: StrapiBackgroundOptionalSchema,
  container: StrapiContainerSchema,
  buttons: z
    .array(StrapiButtonSchema)
    .nullable()
    .transform(omitNull)
    .optional(),
  __component: z.literal("page.box"),
  ...HasStrapiIdSchema.shape,
  ...OptionalStrapiLinkIdentifierSchema.shape,
});
