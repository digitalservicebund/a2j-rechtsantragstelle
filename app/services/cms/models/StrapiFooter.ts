import omit from "lodash/omit";
import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";
import { OptionalStrapiLinkIdentifierSchema } from "./HasStrapiLinkIdentifier";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { StrapiImageOptionalSchema } from "./StrapiImage";
import { StrapiLinkSchema } from "./StrapiLink";
import { StrapiParagraphSchema } from "./StrapiParagraph";

export const StrapiFooterSchema = z
  .object({
    image: StrapiImageOptionalSchema,
    paragraphs: z.array(StrapiParagraphSchema),
    links: z.array(StrapiLinkSchema),
    categorizedLinks: z.array(
      z
        .object({ title: z.string(), links: z.array(StrapiLinkSchema) })
        .merge(OptionalStrapiLinkIdentifierSchema)
        .merge(HasStrapiIdSchema),
    ),
  })
  .merge(HasStrapiLocaleSchema)
  .transform((cmsData) => omit(cmsData, "locale"));

export type StrapiFooter = z.input<typeof StrapiFooterSchema>;
