import { z } from "zod";
import { type FooterProps } from "~/components/Footer";
import { omitNull } from "~/util/omitNull";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StrapiImageSchema } from "./StrapiImage";
import { StrapiLinkSchema } from "./StrapiLink";
import { StrapiParagraphSchema } from "./StrapiParagraph";

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
  return omitNull({
    links: cmsData.links,
    paragraphs: cmsData.paragraphs,
    image: cmsData.image ?? {},
  });
};
