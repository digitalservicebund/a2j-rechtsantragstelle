import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiStringOptional } from "./StrapiStringOptional";

export const StrapiSummaryOverviewSchema = z
  .object({
    navigation: z
      .array(
        z.object({
          title: StrapiStringOptional,
          boxes: z.array(
            z.object({
              title: StrapiStringOptional,
              stepId: z.string(),
              hiddenFields: StrapiStringOptional,
              sortedFields: StrapiStringOptional,
            }),
          ),
        }),
      )
      .nonempty(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    __component: "page.summary-overview" as const,
    ...cmsData,
  }));
