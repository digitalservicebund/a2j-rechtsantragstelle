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

export const isStrapiArraySummary = (
  strapiContent: StrapiContentComponent,
): strapiContent is z.infer<typeof StrapiArraySummaryComponentSchema> =>
  strapiContent.__component === "page.array-summary";
