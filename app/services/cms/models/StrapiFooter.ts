import { z } from "zod";
import { StrapiImageSchema } from "./StrapiImage";
import { StrapiLinkSchema } from "./StrapiLink";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";

export const StrapiFooterSchema = z
  .object({
    image: StrapiImageSchema,
    paragraphs: z.array(StrapiParagraphSchema),
    links: z.array(StrapiLinkSchema),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema)
  .strict();

export type StrapiFooter = z.infer<typeof StrapiFooterSchema>;
