/* eslint @typescript-eslint/require-await: 0 */
import fs from "node:fs";
import type { GetStrapiEntryOpts } from "./index.server";
import {
  type StrapiFileContent,
  StrapiFileContentSchema,
} from "./models/StrapiFileContent";
import { defaultLocale } from "./models/StrapiLocale";
import { config } from "../env/env.server";

let content: StrapiFileContent | undefined;

export const getStrapiEntryFromFile = async ({
  locale = defaultLocale,
  ...opts
}: GetStrapiEntryOpts) => {
  if (!content) {
    try {
      const filePath = config().CONTENT_FILE_PATH;
      const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
      content = StrapiFileContentSchema.parse(JSON.parse(fileContent));
    } catch {
      throw Error(
        "No valid content.json found while using 'CMS=FILE'.\nEither run 'npm run dumpCmsToFile' or try another CMS source.",
      );
    }
  }
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
