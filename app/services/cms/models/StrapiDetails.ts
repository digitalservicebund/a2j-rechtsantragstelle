import pick from "lodash/pick";
import { z } from "zod";
import { type DetailsProps } from "~/components/Details";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiDetailsSchema = z
  .object({
    title: z.string(),
    content: buildRichTextValidation(),
  })
  .merge(HasOptionalStrapiIdSchema);

type StrapiDetails = z.infer<typeof StrapiDetailsSchema>;

export const StrapiDetailsComponentSchema = StrapiDetailsSchema.extend({
  __component: z.literal("page.details-summary"),
});

export const getDetailsProps = (cmsData: StrapiDetails): DetailsProps =>
  pick(cmsData, "content", "title");
