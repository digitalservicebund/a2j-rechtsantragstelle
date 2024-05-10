import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "../models/HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "../models/HasStrapiLinkIdentifier";
import { DetailsSummary } from "~/components/DetailsSummary";
import { omitNull } from "~/util/omitNull";

export const StrapiDetailsSummarySchema = z
  .object({
    title: z.string().nullable(),
    content: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(OptionalStrapiLinkIdentifierSchema);

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
