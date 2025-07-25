import omit from "lodash/omit";
import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StrapiImageOptionalSchema } from "./StrapiImage";
import { StrapiLinkSchema } from "./StrapiLink";
import { StrapiParagraphSchema } from "./StrapiParagraph";

export const StrapiFooterSchema = z
  .object({
    image: StrapiImageOptionalSchema,
    paragraphs: z.array(StrapiParagraphSchema),
    categorizedLinks: z
      .array(
        z
          .object({
            title: z.string().nonempty(),
            links: z.array(StrapiLinkSchema).nonempty(),
          })
          .merge(HasStrapiIdSchema),
      )
      .nonempty(),
  })
  .merge(HasStrapiLocaleSchema)
  .transform((cmsData) => omit(cmsData, "locale"));

export type StrapiFooter = z.input<typeof StrapiFooterSchema>;
