import { z } from "zod";
import { variantWidths, type Variant } from "~/components/content/BoxWithImage";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "../HasStrapiLinkIdentifier";
import { StrapiBackgroundOptionalSchema } from "../StrapiBackground";
import { StrapiContainerSchema } from "../StrapiContainer";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";
import { StrapiImageSchema } from "../StrapiImage";

// Necessary destructuring for zod enum type
const [firstWidth, ...widths] = Object.keys(variantWidths).map(
  (key) => key as Variant,
);

export const StrapiBoxWithImageSchema = z.object({
  heading: StrapiHeadingOptionalSchema,
  image: StrapiImageSchema,
  content: StrapiRichTextOptionalSchema(),
  outerBackground: StrapiBackgroundOptionalSchema,
  variant: z
    .enum([firstWidth, ...widths])
    .nullable()
    .transform(omitNull),
  container: StrapiContainerSchema,
  __component: z.literal("page.box-with-image"),
  ...HasStrapiIdSchema.shape,
  ...OptionalStrapiLinkIdentifierSchema.shape,
});
