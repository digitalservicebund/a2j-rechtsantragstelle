import pick from "lodash/pick";
import { z } from "zod";
import { type DetailsProps } from "~/components/Details";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiDetailsSchema = z
  .object({
    title: z.string(),
    content: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiDetails = z.infer<typeof StrapiDetailsSchema>;

export const StrapiDetailsComponentSchema = StrapiDetailsSchema.extend({
  __component: z.literal("page.details-summary"),
});

export const getDetailsProps = (cmsData: StrapiDetails): DetailsProps =>
  pick(cmsData, "content", "title");
