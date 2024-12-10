import pick from "lodash/pick";
import { z } from "zod";
import type { InfoBoxItemProps } from "~/components/InfoBoxItem";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiButtonSchema } from "./StrapiButton";
import { getDetailsProps, StrapiDetailsSchema } from "./StrapiDetails";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiImageSchema, getImageProps } from "./StrapiImage";

export const StrapiInfoBoxItemSchema = z
  .object({
    label: StrapiHeadingSchema.nullable(),
    headline: StrapiHeadingSchema.nullable(),
    image: StrapiImageSchema,
    content: z.string().nullable(),
    detailsSummary: z.array(StrapiDetailsSchema),
    buttons: z.array(StrapiButtonSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiInfoBoxItem = z.infer<typeof StrapiInfoBoxItemSchema>;

export const getInfoBoxItemProps = (
  cmsData: StrapiInfoBoxItem,
): InfoBoxItemProps =>
  omitNull({
    details: cmsData.detailsSummary.map(getDetailsProps),
    image: getImageProps(cmsData.image),
    ...pick(cmsData, "label", "headline", "content", "buttons", "identifier"),
  });
