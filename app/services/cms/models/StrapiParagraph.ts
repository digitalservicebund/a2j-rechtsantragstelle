import pick from "lodash/pick";
import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiParagraphSchema = z
  .object({
    text: buildRichTextValidation(),
  })
  .merge(HasStrapiIdSchema)
  .transform((cmsData) => ({
    ...pick(cmsData, "__component", "id"),
    __component: "basic.paragraph" as const,
    html: cmsData.text,
  }));

export type StrapiParagraph = z.input<typeof StrapiParagraphSchema>;
