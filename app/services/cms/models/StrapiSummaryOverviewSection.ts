import { z } from "zod";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema, HasStrapiIdSchema } from "./HasStrapiId";
import { StrapiHeadingSchema } from "./StrapiHeading";
import { StrapiStringOptionalSchema } from "./StrapiStringOptional";

const StrapiSummaryOverviewBoxItemInlineSchema = z.object({
  field: z.string(),
  emptyValuePlaceholder: StrapiStringOptionalSchema,
});

const StrapiSummaryOverviewBoxSchema = z
  .object({
    title: StrapiHeadingSchema.nullable().transform(omitNull),
    stepId: z.string(),
    boxItems: z
      .array(
        z.object({
          title: StrapiStringOptionalSchema,
          inlineItems: z.array(StrapiSummaryOverviewBoxItemInlineSchema),
        }),
      )
      .nonempty(),
  })
  .merge(HasStrapiIdSchema);

export const StrapiSummaryOverviewSectionSchema = z
  .object({
    __component: z.literal("page.summary-overview-section"),
    title: StrapiHeadingSchema,
    boxes: z.array(StrapiSummaryOverviewBoxSchema).nonempty(),
  })
  .merge(HasOptionalStrapiIdSchema);
