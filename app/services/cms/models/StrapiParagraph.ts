import pick from "lodash/pick";
import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiParagraphSchema = z
  .object({
    text: buildRichTextValidation(),
    ...HasStrapiIdSchema.shape,
  })
  .transform((cmsData) => ({
    ...pick(cmsData, "__component"),
    __component: "basic.paragraph" as const,
    id: cmsData.id, // set the id, or the schema makes it optional
    html: cmsData.text,
  }));

export type StrapiParagraph = z.input<typeof StrapiParagraphSchema>;
