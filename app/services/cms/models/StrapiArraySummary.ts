import { z } from "zod";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";

export const StrapiArraySummaryComponentSchema = z.object({
  category: z.string(),
  categoryUrl: z.string(),
  title: StrapiHeadingOptionalSchema,
  description: StrapiRichTextOptionalSchema(),
  subtitle: StrapiHeadingOptionalSchema,
  buttonLabel: stringOptionalSchema,
  __component: z.literal("page.array-summary"),
  ...HasStrapiIdSchema.shape,
});
