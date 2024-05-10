import { z } from "zod";
import { StrapiButtonSchema } from "./StrapiButton";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiImageSchema, getImageProps } from "./StrapiImage";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { omitNull } from "~/util/omitNull";
import { InfoBoxItemPropsSchema } from "~/components/InfoBoxItem";
import { type StrapiElementWithId } from "./StrapiElementWithId";
import { StrapiDetailsSummarySchema } from "../components/StrapiDetailsSummary";

export const StrapiInfoBoxItemSchema = z
  .object({
    label: StrapiHeadingSchema.nullable(),
    headline: StrapiHeadingSchema.nullable(),
    image: StrapiImageSchema.nullable(),
    content: z.string().nullable(),
    detailsSummary: StrapiDetailsSummarySchema.nullable(),
    buttons: z.array(StrapiButtonSchema).nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

export const StrapiInfoBoxItemComponentSchema = StrapiInfoBoxItemSchema.extend({
  __component: z.literal("page.info-box-item"),
});

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
