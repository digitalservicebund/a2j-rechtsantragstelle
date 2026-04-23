import { type Renderer } from "marked";
import { z } from "zod";
import { parseAndSanitizeMarkdown } from "~/services/security/markdownUtilities";
import { omitNull } from "~/util/omitNull";

export const buildRichTextValidation = (renderer?: Partial<Renderer>) =>
  z
    .string()
    .transform(async (text) => parseAndSanitizeMarkdown(text, renderer));

export const StrapiRichTextOptionalSchema = (renderer?: Partial<Renderer>) =>
  buildRichTextValidation(renderer).nullable().transform(omitNull).optional();
