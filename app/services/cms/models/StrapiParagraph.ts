import { z } from "zod";
import { type RichTextProps } from "~/components/RichText";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiParagraphSchema = z
  .object({ text: z.string() })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiParagraphComponentSchema = StrapiParagraphSchema.extend({
  __component: z.literal("basic.paragraph"),
});

export type StrapiParagraph = z.infer<typeof StrapiParagraphSchema>;

export const getRichTextProps = (cmsData: StrapiParagraph): RichTextProps => ({
  markdown: cmsData.text,
});
