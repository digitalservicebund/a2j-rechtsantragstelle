import pick from "lodash/pick";
import { z } from "zod";
import { type DetailsSummaryProps } from "~/components/DetailsSummary";
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

export const getDetailsSummaryProps = (
  strapiDetailsSummary: StrapiDetailsSummary,
): DetailsSummaryProps => pick(strapiDetailsSummary, "content", "title");
