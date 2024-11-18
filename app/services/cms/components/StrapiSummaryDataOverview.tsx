import { z } from "zod";
import type { SummaryDataOverviewProps } from "~/components/SummaryDataOverview";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

const StrapiSummaryDataOverviewSchema = z
  .object({
    heading: z.string(),
    content: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);

type SummaryDataOverviewComponent = z.infer<
  typeof StrapiSummaryDataOverviewSchema
>;

export const StrapiSummaryDataOverviewComponentSchema =
  StrapiSummaryDataOverviewSchema.extend({
    __component: z.literal("page.summary-data-overview"),
  });

export const getSummaryDataOverviewProps = ({
  ...cmsData
}: SummaryDataOverviewComponent): SummaryDataOverviewProps => {
  return omitNull({ ...cmsData, content: cmsData.content });
};
