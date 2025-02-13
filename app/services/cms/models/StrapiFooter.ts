import omit from "lodash/omit";
import { z } from "zod";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StrapiImageOptionalSchema } from "./StrapiImage";
import { StrapiLinkSchema } from "./StrapiLink";
import { StrapiParagraphSchema } from "./StrapiParagraph";

export const StrapiFooterSchema = z
  .object({
    image: StrapiImageOptionalSchema,
    paragraphs: z.array(StrapiParagraphSchema),
    links: z.array(StrapiLinkSchema),
  })
  .merge(HasStrapiLocaleSchema)
  .transform((cmsData) => omit(cmsData, "locale"));
