import { z } from "zod";
import { variantWidths, type Variant } from "~/components/BoxWithImage";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";
import { StrapiImageSchema } from "./StrapiImage";

// Necessary destructuring for zod enum type
const [firstWidth, ...widths] = Object.keys(variantWidths).map(
  (key) => key as Variant,
);

export const StrapiBoxWithImageSchema = z
  .object({
    heading: StrapiHeadingOptionalSchema,
    image: StrapiImageSchema,
    content: StrapiRichTextOptionalSchema(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    variant: z
      .enum([firstWidth, ...widths])
      .nullable()
      .transform(omitNull),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema)
  .transform((cmsData) => ({
    __component: "page.box-with-image" as const,
    ...cmsData,
    image: cmsData.image ?? {},
  }));
