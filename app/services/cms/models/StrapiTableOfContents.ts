import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundOptionalSchema } from "./StrapiBackground";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";
import { StrapiLinkSchema } from "./StrapiLink";

export const StrapiTableOfContentsSchema = z
  .object({
    label: StrapiHeadingOptionalSchema,
    heading: StrapiHeadingOptionalSchema,
    buttons: z.array(StrapiButtonSchema),
    outerBackground: StrapiBackgroundOptionalSchema,
    container: StrapiContainerSchema,
    links: z.array(StrapiLinkSchema),
    __component: z.literal("page.table-of-contents"),
  })
  .merge(HasStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);
