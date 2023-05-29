import { z } from "zod";
import { HasStrapiIdSchema } from "./HasStrapiId";

export const StrapiParagraphSchema = z
  .object({
    __component: z.literal("basic.paragraph").optional(),
    text: z.string(),
  })
  .merge(HasStrapiIdSchema)
  .strict();

export type StrapiParagraph = z.infer<typeof StrapiParagraphSchema>;
