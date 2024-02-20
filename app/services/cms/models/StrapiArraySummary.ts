import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import type { StrapiContent } from "./StrapiContent";

export const StrapiArraySummarySchema = z
  .object({
    __component: z.literal("page.array-summary"),
    arrayKey: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);

export type StrapiArraySummary = z.infer<typeof StrapiArraySummarySchema>;

export const isStrapiArraySummary = (
  strapiContent: StrapiContent,
): strapiContent is StrapiArraySummary =>
  strapiContent.__component === "page.array-summary";
