import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";

export const StrapiBoxSchema = z
  .object({
    __component: z.literal("page.box").optional(),
    label: StrapiHeadingSchema.nullable(),
    heading: StrapiHeadingSchema.nullable(),
    content: StrapiParagraphSchema.nullable(),
    button: StrapiButtonSchema.nullable(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema)
  .strict();

export type StrapiBox = z.infer<typeof StrapiBoxSchema>;
