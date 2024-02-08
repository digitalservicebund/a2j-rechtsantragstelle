import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiArraySummarySchema = z
  .object({
    __component: z.literal("page.array-summary").optional(),
    title: z.string(),
    description: z.string().nullable(),
    arrayKey: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
