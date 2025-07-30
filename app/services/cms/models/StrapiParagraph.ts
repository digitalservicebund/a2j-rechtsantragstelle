import pick from "lodash/pick";
import { type Renderer } from "marked";
import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasStrapiIdSchema } from "./HasStrapiId";

export const createParagraphRenderer = (id: number): Partial<Renderer> => ({
  paragraph({ text }) {
    return `<p id="paragraph-${id}">${text}</p>`;
  },
});

export const StrapiParagraphSchema = z
  .object({
    text: z.string(),
    ...HasStrapiIdSchema.shape,
  })
  .transform((cmsData) => ({
    ...pick(cmsData, "__component"),
    __component: "basic.paragraph" as const,
    id: cmsData.id, // set the id, or the schema makes it optional
    html: buildRichTextValidation(createParagraphRenderer(cmsData.id)).parse(
      cmsData.text,
    ),
  }));

export type StrapiParagraph = z.input<typeof StrapiParagraphSchema>;
