import { z } from "zod";
import { type FooterProps } from "~/components/Footer";
import { omitNull } from "~/util/omitNull";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StrapiImageOptionalSchema } from "./StrapiImage";
import { StrapiLinkSchema } from "./StrapiLink";
import { StrapiParagraphSchema, getRichTextProps } from "./StrapiParagraph";

export const StrapiFooterSchema = z
  .object({
    image: StrapiImageOptionalSchema,
    paragraphs: z.array(StrapiParagraphSchema),
    links: z.array(StrapiLinkSchema),
  })
  .merge(HasStrapiLocaleSchema);

export type StrapiFooter = z.infer<typeof StrapiFooterSchema>;

export const getFooterProps = (
  cmsData: StrapiFooter,
): Omit<FooterProps, "deletionLabel" | "showDeletionBanner"> => {
  const { links, paragraphs, image } = cmsData;
  return omitNull({
    links,
    paragraphs: paragraphs?.map((p) => getRichTextProps(p)),
    image,
  });
};
