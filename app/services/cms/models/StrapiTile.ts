import { type Renderer } from "marked";
import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { StrapiImageOptionalSchema } from "./StrapiImage";

export const createTileRenderer = (value: string): Partial<Renderer> => ({
  paragraph({ text }) {
    return `<p id="${value}-description" class="ds-subhead">${text}</p>`;
  },
});

export const StrapiTileSchema = z
  .object({
    title: z.string(),
    value: z.string(),
    description: z.string().nullable(),
    image: StrapiImageOptionalSchema,
    tagDescription: z.string().nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) => {
    const tileRenderer = createTileRenderer(cmsData.value);
    const parsed = buildRichTextValidation(tileRenderer)
      .nullable()
      .safeParse(cmsData.description);

    return {
      ...cmsData,
      description: parsed.success ? parsed.data : null,
    };
  });
