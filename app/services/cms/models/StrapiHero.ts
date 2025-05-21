import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiBackgroundSchema } from "./StrapiBackground";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";

export const StrapiHeroSchema = z
  .object({
    heading: StrapiHeadingSchema,
    content: StrapiParagraphSchema.nullable().transform(omitNull),
    outerBackground: StrapiBackgroundSchema.nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    __component: "page.hero" as const,
    ...cmsData,
  }));
