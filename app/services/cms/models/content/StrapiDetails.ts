import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "../HasStrapiId";
import { StrapiBackgroundColorOptionalSchema } from "../StrapiBackgroundColor";

export const StrapiDetailsSchema = z
  .object({
    title: z.string(),
    content: buildRichTextValidation(),
    sectionBackgroundColor: StrapiBackgroundColorOptionalSchema,
    ...HasStrapiIdSchema.shape,
  })
  .transform((cmsData) => ({
    __component: "page.details-summary" as const,
    ...cmsData,
  }));
