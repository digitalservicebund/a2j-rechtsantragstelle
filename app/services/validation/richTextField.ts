import { z } from "zod";

export const RICH_TEXT_WORD_LIMIT = 2;

export const richTextZodDescription = "richText";

const countWordsFromText = (text: string) =>
  (text.trim().match(/\S+/gu) ?? []).length;

export const richTextRequiredSchema = z
  .string()
  .trim()
  .min(1, { message: "required" })
  .refine(
    (value) => {
      const normalized = value.trim();

      const withoutTags = normalized
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .trim();

      return withoutTags.length > 0;
    },
    { message: "required" },
  )
  .refine((value) => countWordsFromText(value) <= RICH_TEXT_WORD_LIMIT, {
    message: `Maximal ${RICH_TEXT_WORD_LIMIT} Wörter erlaubt.`,
  })
  .describe(richTextZodDescription);
