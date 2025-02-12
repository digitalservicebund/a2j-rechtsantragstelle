import { Renderer } from "marked";
import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiImageOptionalSchema } from "./StrapiImage";

export const tileRenderer: Partial<Renderer> = {
  paragraph({ text }) {
    return `<p class="ds-subhead">${text}</p>`;
  },
};

export const StrapiTileSchema = z
  .object({
    title: z.string(),
    value: z.string(),
    description: buildRichTextValidation(tileRenderer).nullable(),
    image: StrapiImageOptionalSchema,
    tagDescription: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema);
