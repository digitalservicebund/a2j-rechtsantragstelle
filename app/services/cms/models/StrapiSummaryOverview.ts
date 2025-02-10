import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiSummaryOverviewSchema = z
  .object({
    navigation: z
      .array(
        z.object({
          title: z.string().nullable().transform(omitNull).optional(),
          boxes: z.array(
            z.object({
              title: z.string().nullable().transform(omitNull).optional(),
              stepId: z.string(),
              hiddenFields: z
                .string()
                .nullable()
                .transform(omitNull)
                .optional(),
              sortedFields: z
                .string()
                .nullable()
                .transform(omitNull)
                .optional(),
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
