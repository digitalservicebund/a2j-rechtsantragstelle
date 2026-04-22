import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { StrapiButtonSchema } from "../StrapiButton";
import { StrapiBackgroundColorOptionalSchema } from "../StrapiBackgroundColor";

export const StrapiHeroSchema = z.object({
  heading: StrapiHeadingSchema,
  content: StrapiParagraphSchema.nullable().transform(omitNull),
  button: StrapiButtonSchema.nullable().transform(omitNull),
  sectionBackgroundColor: StrapiBackgroundColorOptionalSchema,
  __component: z.literal("page.hero"),
  ...HasStrapiIdSchema.shape,
});
