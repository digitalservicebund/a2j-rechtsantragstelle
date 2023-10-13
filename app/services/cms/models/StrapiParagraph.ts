import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { RichTextPropsSchema } from "~/components/RichText";
import { omitNull } from "~/util/omitNull";

export const StrapiParagraphSchema = z
  .object({
    __component: z.literal("basic.paragraph").optional(),
    text: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema);

export type StrapiParagraph = z.infer<typeof StrapiParagraphSchema>;

export const getRichTextProps = (cmsData: StrapiParagraph) => {
  const markdown = cmsData.text;
  return RichTextPropsSchema.parse(omitNull({ ...cmsData, markdown }));
};
