import { z } from "zod";
import { type RichTextProps } from "~/components/RichText";
import { buildRichTextValidation } from "~/services/validation/richtext";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiParagraphSchema = z
  .object({ text: buildRichTextValidation() })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiParagraphComponentSchema = StrapiParagraphSchema.extend({
  __component: z.literal("basic.paragraph"),
});

export type StrapiParagraph = z.infer<typeof StrapiParagraphSchema>;

export const getRichTextProps = (cmsData: StrapiParagraph): RichTextProps => ({
  html: cmsData.text,
});
