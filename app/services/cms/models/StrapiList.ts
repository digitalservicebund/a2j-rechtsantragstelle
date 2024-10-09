import { z } from "zod";
import { type ListProps } from "~/components/List";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiListItemSchema, getListItemProps } from "./StrapiListItem";

const StrapiListSchema = z
  .object({
    heading: StrapiHeadingSchema.nullable(),
    subheading: z.string().nullable(),
    items: z.array(StrapiListItemSchema),
    isNumeric: z.boolean(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiList = z.infer<typeof StrapiListSchema>;

export const StrapiListComponentSchema = StrapiListSchema.extend({
  __component: z.literal("page.list"),
});

export const getListProps = ({ items, ...cmsData }: StrapiList): ListProps => {
  return omitNull({ ...cmsData, items: items.map(getListItemProps) });
};
