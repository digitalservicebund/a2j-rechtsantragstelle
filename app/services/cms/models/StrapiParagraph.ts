import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiParagraphSchema = z
  .object({
    text: buildRichTextValidation(),
    __component: z.literal("basic.paragraph"),
  })
  .merge(HasStrapiIdSchema)
  .transform((cmsData) => ({
    html: cmsData.text,
    ...cmsData,
  }));

export type StrapiParagraph = z.input<typeof StrapiParagraphSchema>;
