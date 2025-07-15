import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiBackgroundOptionalSchema } from "./StrapiBackground";
import { StrapiButtonSchema } from "./StrapiButton";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";

export const StrapiHeroSchema = z
  .object({
    heading: StrapiHeadingSchema,
    content: StrapiParagraphSchema.nullable().transform(omitNull),
    outerBackground: StrapiBackgroundOptionalSchema,
    button: StrapiButtonSchema.nullable().transform(omitNull),
    __component: z.literal("page.hero"),
  })
  .merge(HasStrapiIdSchema);
