import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";

export const StrapiLinkListBoxSchema = z
  .object({
    __component: z.literal("page.link-list-box").optional(),
    label: StrapiHeadingSchema.optional().nullable(),
    heading: StrapiHeadingSchema.optional().nullable(),
    button: StrapiButtonSchema.optional().nullable(),
    outerBackground: StrapiBackgroundSchema.optional().nullable(),
    container: StrapiContainerSchema.optional(),
    links: z
      .array(
        z.object({
          url: z.string().nullable(),
          text: z.string().nullable(),
        })
      )
      .nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema)
  .strict();

export type StrapiLinkListBox = z.infer<typeof StrapiLinkListBoxSchema>;
