import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiSummaryOverviewSchema = z
  .object({
    navigation: z
      .array(
        z
          .object({
            title: z.string().optional(),
            boxes: z
              .array(
                z.object({
                  title: z.string().optional(),
                  page: z.string(),
                  sortedFields: z.string().optional(),
                }),
              )
              .optional(),
          })
          .required(),
      )
      .nonempty(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    __component: "page.summary-overview" as const,
    ...cmsData,
  }));
