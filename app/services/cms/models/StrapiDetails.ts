import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiDetailsSchema = z
  .object({
    title: z.string(),
    content: buildRichTextValidation(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    __component: "page.details-summary" as const,
    ...cmsData,
  }));
