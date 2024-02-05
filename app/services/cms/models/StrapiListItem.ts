import { z } from "zod";
import { StrapiButtonSchema } from "./StrapiButton";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiImageSchema, getImageProps } from "./StrapiImage";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { omitNull } from "~/util/omitNull";
import { ListItemPropsSchema } from "~/components/ListItem";

export const StrapiListItemSchema = z
  .object({
    __component: z.literal("page.list-item").optional(),
    label: StrapiHeadingSchema.nullable(),
    headline: StrapiHeadingSchema.nullable(),
    image: StrapiImageSchema.optional(),
    content: z.string().nullable(),
    buttons: z.array(StrapiButtonSchema).nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiListItem = z.infer<typeof StrapiListItemSchema>;

export const getListItemProps = (cmsData: StrapiListItem) => {
  const props = { ...cmsData, image: getImageProps(cmsData.image) };
  return ListItemPropsSchema.parse(omitNull(props));
};
