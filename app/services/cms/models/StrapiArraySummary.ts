import { z } from "zod";
import { StrapiRichTextOptionalSchema } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingOptionalSchema } from "./StrapiHeading";

const StrapiArraySummaryItemLabelsSchema = z.object({
  item: z.string(),
  value: z.string(),
});

export const StrapiArraySummaryComponentSchema = z.object({
  category: z.string(),
  categoryUrl: z.string(),
  title: StrapiHeadingOptionalSchema,
  description: StrapiRichTextOptionalSchema(),
  subtitle: StrapiHeadingOptionalSchema,
  buttonLabel: z.string(),
  itemLabels: z.array(StrapiArraySummaryItemLabelsSchema).nonempty(),
  __component: z.literal("page.array-summary"),
  ...HasStrapiIdSchema.shape,
});
