import { z } from "zod";
import { RichTextPropsSchema } from "~/components/RichText";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiParagraphSchema = z
  .object({ text: z.string() })
  .merge(HasOptionalStrapiIdSchema);

export const StrapiParagraphComponentSchema = StrapiParagraphSchema.extend({
  __component: z.literal("basic.paragraph"),
});

export type StrapiParagraph = z.infer<typeof StrapiParagraphSchema>;

export const getRichTextProps = (cmsData: StrapiParagraph) => {
  const markdown = cmsData.text;
  return RichTextPropsSchema.parse(omitNull({ ...cmsData, markdown }));
};
