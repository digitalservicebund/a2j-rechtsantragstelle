import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";
import { StrapiLinkSchema } from "./StrapiLink";

export const StrapiLinkListBoxSchema = z
  .object({
    label: StrapiHeadingOptionalSchema,
    heading: StrapiHeadingOptionalSchema,
    buttons: z.array(StrapiButtonSchema),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
    links: z.array(StrapiLinkSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema)
  .transform((cmsData) => ({
    __component: "page.link-list-box" as const,
    ...cmsData,
  }));
