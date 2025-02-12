import { pick } from "lodash";
import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiParagraphSchema = z
  .object({
    __component: z.literal("basic.paragraph"),
    text: buildRichTextValidation(),
  })
  .merge(HasStrapiIdSchema)
  .transform((cmsData) => ({
    ...pick(cmsData, "__component", "id"),
    html: cmsData.text,
  }));

export type StrapiParagraph = z.infer<typeof StrapiParagraphSchema>;
