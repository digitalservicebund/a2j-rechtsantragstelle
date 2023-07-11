import { z } from "zod";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiContainerSchema } from "./StrapiContainer";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { StrapiImageSchema } from "./StrapiImage";

export const StrapiBoxWithImageSchema = z
  .object({
    __component: z.literal("page.box-with-image"),
    heading: StrapiHeadingSchema.nullable(),
    image: StrapiImageSchema,
    imageLabel: z.string().nullable(),
    content: z.string(),
    outerBackground: StrapiBackgroundSchema.nullable(),
    container: StrapiContainerSchema,
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema)
  .strict();

export type StrapiBoxWithImage = z.infer<typeof StrapiBoxWithImageSchema>;
