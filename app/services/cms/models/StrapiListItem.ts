import { z } from "zod";
import { type ListItemProps } from "~/components/ListItem";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiHeadingSchema } from "./StrapiHeading";

export const StrapiListItemSchema = z
  .object({
    headline: StrapiHeadingSchema.nullable(),
    content: buildRichTextValidation().nullable(),
    buttons: z.array(StrapiButtonSchema).nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiListItem = z.infer<typeof StrapiListItemSchema>;

export const getListItemProps = (cmsData: StrapiListItem): ListItemProps =>
  omitNull(cmsData);
