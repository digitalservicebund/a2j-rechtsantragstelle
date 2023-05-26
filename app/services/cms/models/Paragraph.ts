import { z } from "zod";
import { HasIdSchema } from "./HasId";

export const ParagraphSchema = z
  .object({
    __component: z.literal("basic.paragraph").optional(),
    text: z.string(),
  })
  .merge(HasIdSchema)
  .strict();

export type Paragraph = z.infer<typeof ParagraphSchema>;
