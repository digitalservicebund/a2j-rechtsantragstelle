import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiImageSchema, getImageProps } from "./StrapiImage";
import { omitNull } from "~/util/omitNull";
import { BoxWithImagePropsSchema } from "~/components/BoxWithImage";

const StrapiBoxWithImageSchema = z
  .object({
    heading: StrapiHeadingSchema.nullable(),
    image: StrapiImageSchema,
    imageLabel: z.string().nullable(),
    content: z.string().nullable(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

export const StrapiBoxWithImageComponentSchema =
  StrapiBoxWithImageSchema.extend({
    __component: z.literal("page.box-with-image"),
  });

type StrapiBoxWithImage = z.infer<typeof StrapiBoxWithImageSchema>;

export const getBoxWithImageProps = (cmsData: StrapiBoxWithImage) => {
  const props = { ...cmsData, image: getImageProps(cmsData.image) };
  return BoxWithImagePropsSchema.parse(omitNull(props));
};
