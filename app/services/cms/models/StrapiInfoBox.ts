import { z } from "zod";
import { StrapiBooleanOptionalSchema } from "~/services/cms/models/StrapiBooleanOptional";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundOptionalSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";
import { StrapiInfoBoxItemSchema } from "./StrapiInfoBoxItem";

export const StrapiInfoBoxSchema = z
  .object({
    heading: StrapiHeadingOptionalSchema,
    items: z.array(StrapiInfoBoxItemSchema),
    outerBackground: StrapiBackgroundOptionalSchema,
    separator: StrapiBooleanOptionalSchema,
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema)
  .transform((cmsData) => ({
    __component: "page.info-box" as const,
    ...cmsData,
  }));
