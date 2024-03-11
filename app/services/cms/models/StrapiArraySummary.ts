import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import type { StrapiContent } from "./StrapiContent";

export const StrapiArraySummarySchema = z
  .object({
    __component: z.literal("page.array-summary"),
    arrayKey: z.string(),
    category: z.string(),
    categoryUrl: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiArraySummary = z.infer<typeof StrapiArraySummarySchema>;

export const isStrapiArraySummary = (
  strapiContent: StrapiContent,
): strapiContent is StrapiArraySummary =>
  strapiContent.__component === "page.array-summary";
