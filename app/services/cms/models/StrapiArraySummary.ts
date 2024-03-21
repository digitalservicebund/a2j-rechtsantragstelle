import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import type { StrapiContentComponent } from "./StrapiContentComponent";

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

export type StrapiArraySummaryComponent = z.infer<
  typeof StrapiArraySummaryComponentSchema
>;

export const isStrapiArraySummary = (
  strapiContent: StrapiContentComponent,
): strapiContent is StrapiArraySummaryComponent =>
  strapiContent.__component === "page.array-summary";
