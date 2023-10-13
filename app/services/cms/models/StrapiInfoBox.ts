import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import {
  StrapiInfoBoxItemSchema,
  getInfoBoxItemProps,
} from "./StrapiInfoBoxItem";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { omitNull } from "~/util/omitNull";
import { InfoBoxPropsSchema } from "~/components/InfoBox";

export const StrapiInfoBoxSchema = z
  .object({
    __component: z.literal("page.info-box").optional(),
    heading: StrapiHeadingSchema.nullable(),
    items: z.array(StrapiInfoBoxItemSchema),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

export type StrapiInfoBox = z.infer<typeof StrapiInfoBoxSchema>;

export const getInfoBoxProps = (cmsData: StrapiInfoBox) => {
  const items = cmsData.items.map(getInfoBoxItemProps);
  return InfoBoxPropsSchema.parse(omitNull({ ...cmsData, items }));
};
