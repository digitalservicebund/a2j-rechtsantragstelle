import { z } from "zod";
import { type FooterProps } from "~/components/Footer";
import { omitNull } from "~/util/omitNull";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";
import { StrapiImageSchema, getImageProps } from "./StrapiImage";
import { StrapiLinkSchema } from "./StrapiLink";
import { StrapiParagraphSchema, getRichTextProps } from "./StrapiParagraph";

export const StrapiFooterSchema = z
  .object({
    image: StrapiImageSchema.nullable(),
    paragraphs: z.array(StrapiParagraphSchema),
    links: z.array(StrapiLinkSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);

export type StrapiFooter = z.infer<typeof StrapiFooterSchema>;

export const getFooterProps = (
  cmsData: StrapiFooter,
): Omit<FooterProps, "deletionLabel" | "showDeletionBanner"> => {
  const paragraphs = cmsData.paragraphs?.map((p) => getRichTextProps(p));
  const image = getImageProps(cmsData.image);
  return omitNull({ links: cmsData.links, paragraphs, image });
};
