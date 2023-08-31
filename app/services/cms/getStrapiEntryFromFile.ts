/* eslint @typescript-eslint/require-await: 0 */
import type { GetStrapiEntryOpts } from "./index.server";
import contentFile from "../../../content.json";
import {
  type StrapiFileContent,
  StrapiFileContentSchema,
} from "./models/StrapiFileContent";
import { defaultLocale } from "./models/StrapiLocale";

let content: StrapiFileContent | undefined;

export const getStrapiEntryFromFile = async ({
  locale = defaultLocale,
  ...opts
}: GetStrapiEntryOpts) => {
  if (!content) content = StrapiFileContentSchema.parse(contentFile);
  return [...content[opts.apiId]].find((item) => {
    if ("locale" in item.attributes && item.attributes.locale !== locale)
      return false;

    return !(
      opts.slug &&
      "slug" in item.attributes &&
      item.attributes.slug !== opts.slug
    );
  })?.attributes;
};
