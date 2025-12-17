import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { StrapiBackgroundOptionalSchema } from "../StrapiBackground";
import { StrapiButtonSchema } from "../StrapiButton";

export const StrapiHeroSchema = z.object({
  heading: StrapiHeadingSchema,
  content: StrapiParagraphSchema.nullable().transform(omitNull),
  outerBackground: StrapiBackgroundOptionalSchema,
  button: StrapiButtonSchema.nullable().transform(omitNull),
  __component: z.literal("page.hero"),
  ...HasStrapiIdSchema.shape,
});
