import type { z } from "zod";
import { countWordsInRichTextMarkdown } from "~/services/richText/plateMarkdown";

export const richTextEditorZodDescription = "rich_text_editor";

export const withRichTextEditorValidation = <T extends z.ZodType<string>>(
  schema: T,
): T => {
  return schema
    .superRefine((value, ctx) => {
      const wordCount = countWordsInRichTextMarkdown(value ?? "");
      if (wordCount > 2000) {
        ctx.addIssue({ code: "custom", message: "maxWords" });
      }
    })
    .meta({ description: richTextEditorZodDescription }) as T;
};
