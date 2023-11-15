import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import {
  StrapiNumericListItemSchema,
  getNumericListItemProps,
} from "./StrapiNumericListItem";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { omitNull } from "~/util/omitNull";
import { NumericListPropsSchema } from "~/components/NumericList";

export const StrapiNumericListSchema = z
  .object({
    __component: z.literal("page.numeric-list").optional(),
    heading: StrapiHeadingSchema.nullable(),
    items: z.array(StrapiNumericListItemSchema),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

export type StrapiNumericList = z.infer<typeof StrapiNumericListSchema>;

export const getNumericListProps = (cmsData: StrapiNumericList) => {
  const items = cmsData.items.map(getNumericListItemProps);
  return NumericListPropsSchema.parse(omitNull({ ...cmsData, items }));
};
