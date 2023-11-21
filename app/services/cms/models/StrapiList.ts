import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiListItemSchema, getListItemProps } from "./StrapiListItem";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { omitNull } from "~/util/omitNull";
import { ListPropsSchema } from "~/components/List";

export const StrapiListSchema = z
  .object({
    __component: z.literal("page.list").optional(),
    heading: StrapiHeadingSchema.nullable(),
    items: z.array(StrapiListItemSchema),
    isNumeric: z.boolean(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiList = z.infer<typeof StrapiListSchema>;

export const getListProps = (cmsData: StrapiList) => {
  const items = cmsData.items.map(getListItemProps);
  return ListPropsSchema.parse(omitNull({ ...cmsData, items }));
};
