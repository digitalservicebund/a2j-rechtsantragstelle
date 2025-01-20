import { z } from "zod";
import { type FooterProps } from "~/components/Footer";
import { StrapiLinkSchema } from "~/services/cms/models/StrapiLink";
import { parseAndSanitizeMarkdown } from "~/services/security/markdownUtilities";
import { omitNull } from "~/util/omitNull";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StrapiImageSchema, getImageProps } from "./StrapiImage";
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
  const paragraphs = cmsData.paragraphs?.map((p) => ({
    markdown: parseAndSanitizeMarkdown(p.text),
  }));
  const image = getImageProps(cmsData.image);
  return omitNull({ links: cmsData.links, paragraphs, image });
};
