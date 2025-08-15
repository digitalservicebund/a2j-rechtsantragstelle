import omit from "lodash/omit";
import { z } from "zod";
import { StrapiParagraphSchema } from "./content/StrapiParagraph";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StrapiImageOptionalSchema } from "./StrapiImage";
import { StrapiLinkSchema } from "./StrapiLink";

export const StrapiFooterSchema = z
  .object({
    image: StrapiImageOptionalSchema,
    paragraphs: z.array(StrapiParagraphSchema),
    categorizedLinks: z
      .array(
        z.object({
          title: z.string().nonempty(),
          links: z.array(StrapiLinkSchema).nonempty(),
          ...HasStrapiIdSchema.shape,
        }),
      )
      .nonempty(),
    ...HasStrapiLocaleSchema.shape,
  })
  .transform((cmsData) => omit(cmsData, "locale"));

export type StrapiFooter = z.input<typeof StrapiFooterSchema>;
