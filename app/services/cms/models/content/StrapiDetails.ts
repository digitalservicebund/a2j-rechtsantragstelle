import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "../HasStrapiId";

export const StrapiDetailsSchema = z
  .object({
    title: z.string(),
    content: buildRichTextValidation(),
    ...HasStrapiIdSchema.shape,
  })
  .transform((cmsData) => ({
    __component: "page.details-summary" as const,
    ...cmsData,
  }));
