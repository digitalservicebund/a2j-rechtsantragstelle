import { z } from "zod";
import type { InfoBoxProps } from "~/components/InfoBox";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { getHeadingProps, StrapiHeadingSchema } from "./StrapiHeading";
import {
  StrapiInfoBoxItemSchema,
  getInfoBoxItemProps,
} from "./StrapiInfoBoxItem";

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

export const getInfoBoxProps = (cmsData: StrapiInfoBox): InfoBoxProps => ({
  heading: getHeadingProps(cmsData.heading),
  items: cmsData.items.map(getInfoBoxItemProps),
  separator: cmsData.separator ?? undefined,
});
