import { z } from "zod";
import { type FooterProps } from "~/components/Footer";
import { omitNull } from "~/util/omitNull";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StrapiImageSchema } from "./StrapiImage";
import { StrapiLinkSchema } from "./StrapiLink";
import { StrapiParagraphSchema, getRichTextProps } from "./StrapiParagraph";

export const StrapiFooterSchema = z
  .object({
    image: StrapiImageSchema.nullable(),
    paragraphs: z.array(StrapiParagraphSchema),
    links: z.array(StrapiLinkSchema),
  })
  .merge(HasStrapiLocaleSchema);

export type StrapiFooter = z.infer<typeof StrapiFooterSchema>;

export const getFooterProps = (
  cmsData: StrapiFooter,
): Omit<FooterProps, "deletionLabel" | "showDeletionBanner"> => {
  const paragraphs = cmsData.paragraphs?.map((p) => getRichTextProps(p));
  return omitNull({
    links: cmsData.links,
    paragraphs,
    image: cmsData.image ?? {},
  });
};
