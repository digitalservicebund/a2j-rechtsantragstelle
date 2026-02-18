import { type Renderer } from "marked";
import { z } from "zod";
import { parseAndSanitizeMarkdown } from "~/services/security/markdownUtilities";
import { omitNull } from "~/util/omitNull";
import { isFeatureFlagEnabled } from "../isFeatureFlagEnabled.server";

export function buildRichTextValidation(renderer?: Partial<Renderer>) {
  return z.string().transform(async (text) => {
    const showKernUX = await isFeatureFlagEnabled("showKernUX");
    return parseAndSanitizeMarkdown(text, renderer, showKernUX);
  });
}

export const StrapiRichTextOptionalSchema = (renderer?: Partial<Renderer>) =>
  buildRichTextValidation(renderer).nullable().transform(omitNull).optional();
