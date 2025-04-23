import { type z } from "zod";
import { type StrapiArraySummaryComponentSchema } from "./StrapiArraySummary";
import { type StrapiContentComponent } from "./StrapiContentComponent";

export const isStrapiArraySummary = (
  strapiContent: StrapiContentComponent,
): strapiContent is z.infer<typeof StrapiArraySummaryComponentSchema> =>
  strapiContent.__component === "page.array-summary";
