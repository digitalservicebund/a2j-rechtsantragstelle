import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

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
