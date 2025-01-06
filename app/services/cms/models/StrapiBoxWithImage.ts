import { z } from "zod";
import {
  variantWidths,
  type Variant,
  type BoxWithImageProps,
} from "~/components/BoxWithImage";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { getHeadingProps, StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiImageSchema, getImageProps } from "./StrapiImage";

// Necessary destructuring for zod enum type
const [firstWidth, ...widths] = Object.keys(variantWidths).map(
  (key) => key as Variant,
);

const StrapiBoxWithImageSchema = z
  .object({
    heading: StrapiHeadingSchema.nullable(),
    image: StrapiImageSchema,
    content: z.string().nullable(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    variant: z.enum([firstWidth, ...widths]).nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

export const StrapiBoxWithImageComponentSchema =
  StrapiBoxWithImageSchema.extend({
    __component: z.literal("page.box-with-image"),
  });

export const getBoxWithImageProps = ({
  heading,
  image,
  ...props
}: z.infer<typeof StrapiBoxWithImageSchema>): BoxWithImageProps => {
  const { content, identifier, variant } = omitNull(props);
  return {
    image: getImageProps(image) ?? {},
    identifier,
    heading: heading ? getHeadingProps(heading) : undefined,
    content,
    variant,
  };
};
