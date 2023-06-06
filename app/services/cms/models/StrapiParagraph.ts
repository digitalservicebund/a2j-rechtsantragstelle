import { z } from "zod";
import { HasOptionalStrapiIdSchema } from "./HasStrapiId";

export const StrapiParagraphSchema = z
  .object({
    __component: z.literal("basic.paragraph").optional(),
    text: z.string(),
  })
  .merge(HasOptionalStrapiIdSchema)
  .strict();

export type StrapiParagraph = z.infer<typeof StrapiParagraphSchema>;
