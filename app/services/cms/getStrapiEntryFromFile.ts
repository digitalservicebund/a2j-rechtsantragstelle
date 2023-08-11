/* eslint @typescript-eslint/require-await: 0 */
import type { GetStrapiEntryOpts } from "./index.server";
import contentFile from "~/../content.json";
import {
  type StrapiFileContent,
  type SingleStrapiEntry,
  StrapiFileContentSchema,
} from "./models/StrapiFileContent";

let content: StrapiFileContent | undefined;

export const getStrapiEntryFromFile = async (
  opts: GetStrapiEntryOpts,
): Promise<SingleStrapiEntry> => {
  if (!content) content = StrapiFileContentSchema.parse(contentFile);
  return [...content[opts.apiId]].find((item) => {
    if ("locale" in item.attributes && item.attributes.locale !== opts.locale)
      return false;

    return !(
      opts.slug &&
      "slug" in item.attributes &&
      item.attributes.slug !== opts.slug
    );
  });
};
