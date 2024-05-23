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

const StrapiInfoBoxSchema = z
  .object({
    heading: StrapiHeadingSchema.nullable(),
    items: z.array(StrapiInfoBoxItemSchema),
    outerBackground: StrapiBackgroundSchema.nullable(),
    separator: z.boolean().nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

type StrapiInfoBox = z.infer<typeof StrapiInfoBoxSchema>;

export const StrapiInfoBoxComponentSchema = StrapiInfoBoxSchema.extend({
  __component: z.literal("page.info-box"),
});

export type StrapiInfoBoxComponent = z.infer<
  typeof StrapiInfoBoxComponentSchema
>;

export const getInfoBoxProps = (cmsData: StrapiInfoBox) => {
  const items = cmsData.items.map(getInfoBoxItemProps);
  return InfoBoxPropsSchema.parse(omitNull({ ...cmsData, items }));
};
