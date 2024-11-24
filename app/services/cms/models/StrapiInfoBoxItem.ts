import { z } from "zod";
import type { InfoBoxItemProps } from "~/components/InfoBoxItem";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiDetailsSummarySchema } from "./StrapiDetailsSummary";
import { type StrapiElementWithId } from "./StrapiElementWithId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiImageSchema, getImageProps } from "./StrapiImage";

export const StrapiInfoBoxItemSchema = z
  .object({
    label: StrapiHeadingSchema.nullable(),
    headline: StrapiHeadingSchema.nullable(),
    image: StrapiImageSchema,
    content: z.string().nullable(),
    detailsSummary: z.array(StrapiDetailsSummarySchema),
    buttons: z.array(StrapiButtonSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

export const StrapiInfoBoxItemComponentSchema = StrapiInfoBoxItemSchema.extend({
  __component: z.literal("page.info-box-item"),
});

type StrapiInfoBoxItem = z.infer<typeof StrapiInfoBoxItemSchema>;

export const getInfoBoxItemProps = (
  cmsData: StrapiInfoBoxItem,
): InfoBoxItemProps =>
  omitNull({ ...cmsData, image: getImageProps(cmsData.image) });

export function infoBoxesFromElementsWithID(
  elementsWithID: StrapiElementWithId[],
) {
  return elementsWithID.flatMap((elementWithID) =>
    elementWithID.element
      .filter((el) => el.__component === "page.info-box-item")
      .map((el) => getInfoBoxItemProps(el as StrapiInfoBoxItem)),
  );
}
