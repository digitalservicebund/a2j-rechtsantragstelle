import { z } from "zod";
import { DetailsSummary } from "~/components/DetailsSummary";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";

export const StrapiDetailsSummarySchema = z
  .object({
    title: z.string(),
    content: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiDetailsSummary = z.infer<typeof StrapiDetailsSummarySchema>;

export const StrapiDetailsSummaryComponentSchema =
  StrapiDetailsSummarySchema.extend({
    __component: z.literal("page.details-summary"),
  });

export const StrapiDetailsSummary = (
  strapiDetailsSummary: StrapiDetailsSummary,
) => {
  const props = omitNull(strapiDetailsSummary);
  return <DetailsSummary {...props} />;
};
