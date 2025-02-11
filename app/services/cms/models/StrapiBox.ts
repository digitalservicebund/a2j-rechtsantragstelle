import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiContainerSchema } from "./StrapiContainer";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";

export const StrapiBoxSchema = z
  .object({
    label: StrapiHeadingSchema.optional(),
    heading: StrapiHeadingSchema.optional(),
    content: StrapiParagraphSchema.transform((content) => ({
      ...content,
      html: content.text,
    })),
    outerBackground: StrapiBackgroundSchema,
    container: StrapiContainerSchema,
    buttons: z.array(StrapiButtonSchema).optional(),
    __component: z.literal("page.box"),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);
