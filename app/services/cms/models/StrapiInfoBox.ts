import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiInfoBoxItemSchema } from "./StrapiInfoBoxItem";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";

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
