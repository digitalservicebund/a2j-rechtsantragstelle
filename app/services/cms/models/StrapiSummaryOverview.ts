import { z } from "zod";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiStringOptionalSchema } from "./StrapiStringOptional";

const StrapiSummaryOverviewBoxItemInlineSchema = z.object({
  field: z.string(),
});

const StrapiSummaryOverviewBoxSchema = z
  .object({
    title: StrapiStringOptionalSchema,
    stepId: z.string(),
    boxItems: z
      .array(
        z.object({
          title: StrapiStringOptionalSchema,
          field: z.string(),
          displayEmptyValue: StrapiStringOptionalSchema,
          inlineItems: z
            .array(StrapiSummaryOverviewBoxItemInlineSchema)
            .optional(),
        }),
      )
      .nonempty(),
  })
  .merge(HasStrapiIdSchema);

export const StrapiSummaryOverviewSchema = z
  .object({
    __component: z.literal("page.summary-overview"),
    navigation: z
      .array(
        z
          .object({
            title: StrapiHeadingSchema,
            boxes: z.array(StrapiSummaryOverviewBoxSchema).nonempty(),
          })
          .merge(HasStrapiIdSchema),
      )
      .nonempty(),
  })
  .merge(HasOptionalStrapiIdSchema);
