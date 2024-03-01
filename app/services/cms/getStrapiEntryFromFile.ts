/* eslint @typescript-eslint/require-await: 0 */
import fs from "node:fs";
import type { GetStrapiEntryOpts } from "./index.server";
import {
  type StrapiFileContent,
  StrapiFileContentSchema,
} from "./models/StrapiFileContent";
import { defaultLocale, stagingLocale } from "./models/StrapiLocale";
import { config } from "../env/env.server";

let content: StrapiFileContent | undefined;

export const getStrapiEntryFromFile = async ({
  locale = config().ENVIRONMENT != "production" ? stagingLocale : defaultLocale,
  ...opts
}: GetStrapiEntryOpts) => {
  if (!content) {
    try {
      const filePath = config().CONTENT_FILE_PATH;
      const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
      content = StrapiFileContentSchema.parse(JSON.parse(fileContent));
    } catch (error) {
      console.error(error);
      throw Error(
        "No valid content.json found while using 'CMS=FILE'.\nEither run 'npm run build:localContent' or try another CMS source",
      );
    }
  }

  const filterField = opts.filterField ?? "slug";

  const contentItems = [...content[opts.apiId]].filter(
    (item) =>
      !(
        opts.filterValue &&
        filterField in item.attributes &&
        item.attributes[filterField as keyof typeof item.attributes] !==
          opts.filterValue
      ),
  );

  // search for the locale
  let contentItem = contentItems.find(
    (item) => "locale" in item.attributes && item.attributes.locale == locale,
  );

  if (!contentItem) {
    // if the locale is not found, search for the default locale
    contentItem = contentItems.find(
      (item) =>
        "locale" in item.attributes && item.attributes.locale == defaultLocale,
    );
  }

  return contentItem?.attributes;
};
