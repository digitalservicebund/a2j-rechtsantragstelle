import { z } from "zod";
import { StrapiButtonSchema } from "./StrapiButton";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiImageSchema, getImageProps } from "./StrapiImage";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { omitNull } from "~/util/omitNull";
import { InfoBoxItemPropsSchema } from "~/components/InfoBoxItem";
import { type StrapiElementWithId } from "./StrapiElementWithId";

export const StrapiInfoBoxItemSchema = z
  .object({
    __component: z.literal("page.info-box-item").optional(),
    label: StrapiHeadingSchema.optional(),
    headline: StrapiHeadingSchema.nullable(),
    image: StrapiImageSchema.optional(),
    content: z.string().optional(),
    buttons: z.array(StrapiButtonSchema).optional(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiInfoBoxItem = z.infer<typeof StrapiInfoBoxItemSchema>;

export const getInfoBoxItemProps = (cmsData: StrapiInfoBoxItem) => {
  const props = { ...cmsData, image: getImageProps(cmsData.image) };
  return InfoBoxItemPropsSchema.parse(omitNull(props));
};

export function infoBoxesFromElementsWithID(
  elementsWithID: StrapiElementWithId[],
) {
  return elementsWithID.flatMap((elementWithID) =>
    elementWithID.element
      .filter((el) => el.__component === "page.info-box-item")
      .map((el) => getInfoBoxItemProps(el as StrapiInfoBoxItem)),
  );
}
