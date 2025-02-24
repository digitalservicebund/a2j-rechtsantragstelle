import { Renderer } from "marked";
import { z } from "zod";
import { parseAndSanitizeMarkdown } from "~/services/security/markdownUtilities";
import { omitNull } from "~/util/omitNull";

export function buildRichTextValidation(renderer?: Partial<Renderer>) {
  return z
    .string()
    .transform((text) => parseAndSanitizeMarkdown(text, renderer));
}

export const StrapiRichTextOptionalSchema = (renderer?: Partial<Renderer>) =>
  buildRichTextValidation(renderer).nullable().transform(omitNull).optional();
