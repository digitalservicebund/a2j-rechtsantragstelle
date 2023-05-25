import { z } from "zod";
import { ImageSchema } from "./Image";
import { LinkSchema } from "./Link";
import { ParagraphSchema } from "./Paragraph";

export const FooterSchema = z.object({
  image: ImageSchema,
  paragraphs: z.array(ParagraphSchema),
  links: z.array(LinkSchema),
});

export type Footer = z.infer<typeof FooterSchema>;
