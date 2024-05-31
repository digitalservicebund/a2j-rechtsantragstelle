import { z } from "zod";
import { BoxWithImagePropsSchema } from "~/components/BoxWithImage";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiImageSchema, getImageProps } from "./StrapiImage";

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
