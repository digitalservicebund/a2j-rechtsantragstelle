import { z } from "zod";
import { StrapiImageSchema } from "./StrapiImage";
import { StrapiLinkSchema } from "./StrapiLink";
import { StrapiParagraphSchema } from "./StrapiParagraph";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";
import { HasStrapiLocaleSchema } from "./HasStrapiLocale";
import { HasStrapiTimestampsSchema } from "./HasStrapiTimestamps";

export const StrapiFooterSchema = z
  .object({
    image: StrapiImageSchema.nullable().optional(),
    paragraphs: z.array(StrapiParagraphSchema).nullable(),
    links: z.array(StrapiLinkSchema).nullable(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .merge(HasStrapiLocaleSchema)
  .merge(HasStrapiTimestampsSchema);

export type StrapiFooter = z.infer<typeof StrapiFooterSchema>;
