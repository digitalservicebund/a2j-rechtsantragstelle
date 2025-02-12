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
            title: StrapiStringOptionalSchema,
            boxes: z
              .array(
                z
                  .object({
                    title: StrapiStringOptionalSchema,
                    stepId: z.string(),
                    hiddenFields: StrapiStringOptionalSchema,
                    sortedFields: StrapiStringOptionalSchema,
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
