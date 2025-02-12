import { z } from "zod";
import { StrapiBooleanOptionalSchema } from "~/services/cms/models/StrapiBooleanOptional";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiInfoBoxItemSchema } from "./StrapiInfoBoxItem";

export const StrapiInfoBoxSchema = z
  .object({
    heading: StrapiHeadingSchema,
    items: z.array(StrapiInfoBoxItemSchema),
    outerBackground: StrapiBackgroundSchema.nullable(),
    separator: StrapiBooleanOptionalSchema,
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema)
  .transform((cmsData) => ({
    __component: "page.info-box" as const,
    ...cmsData,
  }));

export type StrapiInfoBoxComponent = z.infer<typeof StrapiInfoBoxSchema>;
