import { z } from "zod";
import type { InfoBoxProps } from "~/components/InfoBox";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingSchema } from "./StrapiHeading";
import {
  StrapiInfoBoxItemSchema,
  getInfoBoxItemProps,
} from "./StrapiInfoBoxItem";

const StrapiInfoBoxSchema = z
  .object({
    heading: StrapiHeadingSchema,
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
  identifier: cmsData.identifier ?? undefined,
  heading: cmsData.heading,
  items: cmsData.items.map(getInfoBoxItemProps),
  separator: cmsData.separator ?? undefined,
});
