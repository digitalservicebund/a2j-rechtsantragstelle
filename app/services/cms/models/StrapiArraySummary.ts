import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import type { StrapiContent } from "./StrapiContent";

const StrapiArraySummarySchema = z
  .object({
    category: z.string(),
    categoryUrl: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiArraySummaryComponentSchema =
  StrapiArraySummarySchema.extend({
    __component: z.literal("page.array-summary"),
  });

type StrapiArraySummaryComponent = z.infer<
  typeof StrapiArraySummaryComponentSchema
>;

export const isStrapiArraySummary = (
  strapiContent: StrapiContent,
): strapiContent is StrapiArraySummaryComponent =>
  strapiContent.__component === "page.array-summary";
