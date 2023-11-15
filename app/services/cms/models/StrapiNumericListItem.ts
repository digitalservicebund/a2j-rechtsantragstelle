import { z } from "zod";
import { StrapiButtonSchema } from "./StrapiButton";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiImageSchema, getImageProps } from "./StrapiImage";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { omitNull } from "~/util/omitNull";
import { NumericListItemPropsSchema } from "~/components/NumericListItem";
import { type StrapiElementWithId } from "./StrapiElementWithId";

export const StrapiNumericListItemSchema = z
  .object({
    __component: z.literal("page.numeric-list-item").optional(),
    label: StrapiHeadingSchema.nullable(),
    headline: StrapiHeadingSchema.nullable(),
    image: StrapiImageSchema.optional(),
    content: z.string().nullable(),
    buttons: z.array(StrapiButtonSchema).nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiNumericListItem = z.infer<typeof StrapiNumericListItemSchema>;

export const getNumericListItemProps = (cmsData: StrapiNumericListItem) => {
  const props = { ...cmsData, image: getImageProps(cmsData.image) };
  return NumericListItemPropsSchema.parse(omitNull(props));
};

export function NumericListesFromElementsWithID(
  elementsWithID: StrapiElementWithId[],
) {
  return elementsWithID.flatMap((elementWithID) =>
    elementWithID.element
      .filter((el) => el.__component === "page.numeric-list-item")
      .map((el) => getNumericListItemProps(el as StrapiNumericListItem)),
  );
}
