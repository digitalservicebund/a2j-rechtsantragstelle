import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiParagraphSchema = z
  .object({
    text: buildRichTextValidation(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => ({
    ...cmsData,
    __component: "basic.paragraph" as const,
    html: cmsData.text,
  }));

export type StrapiParagraph = z.infer<typeof StrapiParagraphSchema>;
