import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "~/services/cms/models/HasStrapiId";

export const StrapiHiddenInputSchema = z
  .object({
    name: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    __component: "form-elements.hidden-input" as const,
    ...cmsData,
  }));
