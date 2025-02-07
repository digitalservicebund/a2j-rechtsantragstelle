import { z } from "zod";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
export type StrapiParagraph = z.infer<typeof StrapiParagraphSchema>;

export const StrapiParagraphSchema = z
  .object({ text: buildRichTextValidation() })
  .merge(HasOptionalStrapiIdSchema)
  .transform((cmsData) =>
    omitNull({
      __component: "basic.paragraph" as const,
      html: cmsData.text,
      id: cmsData.id,
      text: cmsData.text,
    }),
  );
