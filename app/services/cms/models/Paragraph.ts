import { z } from "zod";

export const ParagraphSchema = z.object({
  id: z.number(),
  __component: z.literal("basic.paragraph").optional(),
  text: z.string(),
});

export type Paragraph = z.infer<typeof ParagraphSchema>;
