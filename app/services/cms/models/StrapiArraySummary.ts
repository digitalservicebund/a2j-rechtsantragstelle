import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiArraySummaryComponentSchema = z
  .object({
    category: z.string(),
    categoryUrl: z.string(),
    __component: z.literal("page.array-summary"),
  })
  .merge(HasStrapiIdSchema);
