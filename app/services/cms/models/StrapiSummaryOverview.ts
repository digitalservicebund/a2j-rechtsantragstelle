import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiStringOptionalSchema } from "./StrapiStringOptional";

export const StrapiSummaryOverviewSchema = z
  .object({
    navigation: z
      .array(
        z.object({
          title: StrapiStringOptionalSchema,
          boxes: z
            .array(
              z.object({
                title: StrapiStringOptionalSchema,
                stepId: z.string(),
                hiddenFields: StrapiStringOptionalSchema,
                sortedFields: StrapiStringOptionalSchema,
              }),
            )
            .nonempty(),
        }),
      )
      .nonempty(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    __component: "page.summary-overview" as const,
    ...cmsData,
  }));
