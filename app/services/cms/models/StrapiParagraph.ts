import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "./HasStrapiId";
export type StrapiParagraph = z.infer<typeof StrapiParagraphSchema>;

export const StrapiParagraphSchema = z
  .object({ text: buildRichTextValidation() })
  .merge(HasStrapiIdSchema)
  .transform((cmsData) => ({
    __component: "basic.paragraph" as const,
    html: cmsData.text,
    id: cmsData.id,
  }));
