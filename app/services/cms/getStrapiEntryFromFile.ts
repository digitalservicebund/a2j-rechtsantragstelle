/* eslint @typescript-eslint/require-await: 0 */
import fs from "node:fs";
import type { GetStrapiEntryOpts } from "./filters";
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
      throw Error(
        "No valid content.json found while using 'CMS=FILE'.\nEither run 'npm run build:localContent' or try another CMS source",
        { cause: error },
      );
    }
  }

  const contentItems = [...content[opts.apiId]].filter(
    (item) =>
      !opts.filters ||
      opts.filters.every(({ field, value }) => {
        const { attributes } = item;
        let containsValue =
          attributes[field as keyof typeof attributes] === value;

        if (field.includes(".")) {
          const [arrayName, fieldName] = field.split(".");
          containsValue = attributes[arrayName].data.some(
            (arrayItem) => arrayItem.attributes[fieldName] === value,
          );
        }
        return containsValue;
      }),
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
