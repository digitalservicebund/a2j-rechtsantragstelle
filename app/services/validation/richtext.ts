import { Renderer } from "marked";
import { z } from "zod";
import { parseAndSanitizeMarkdown } from "~/services/security/markdownUtilities";

export function buildRichTextValidation(renderer?: Partial<Renderer>) {
  return z
    .string()
    .transform((text) => parseAndSanitizeMarkdown(text, renderer));
}
