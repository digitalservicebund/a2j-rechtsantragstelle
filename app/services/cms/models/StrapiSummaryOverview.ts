import { z } from "zod";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiStringOptionalSchema } from "./StrapiStringOptional";

export const StrapiSummaryOverviewSchema = z
  .object({
    __component: z.literal("page.summary-overview"),
    navigation: z
      .array(
        z
          .object({
            title: z.string(),
            boxes: z
              .array(
                z
                  .object({
                    title: StrapiStringOptionalSchema,
                    stepId: z.string(),
                    fields: z.string(),
                  })
                  .merge(HasStrapiIdSchema),
              )
              .nonempty(),
          })
          .merge(HasStrapiIdSchema),
      )
      .nonempty(),
  })
  .merge(HasOptionalStrapiIdSchema);
