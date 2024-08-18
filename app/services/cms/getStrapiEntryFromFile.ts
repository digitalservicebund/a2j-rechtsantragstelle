/* eslint @typescript-eslint/require-await: 0 */
import fs from "node:fs";
import type { GetStrapiEntryOpts } from "./filters";
import { GetStrapiEntry } from "./getStrapiEntry";
import {
  type StrapiFileContent,
  StrapiFileContentSchema,
} from "./models/StrapiFileContent";
import { defaultLocale, stagingLocale } from "./models/StrapiLocale";
import { config } from "../env/env.server";

let content: StrapiFileContent | undefined;

export const getStrapiEntryFromFile: GetStrapiEntry = async <
  T extends keyof StrapiFileContent,
>({
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

  const contentItems = [...content[opts.apiId as T]].filter(
    ({ attributes }) =>
      !opts.filters ||
      opts.filters.every(({ field, value, nestedField }) => {
        const relevantField = (attributes as Record<string, unknown>)[field];
        if (!nestedField) return relevantField === value;

        return (
          typeof relevantField === "object" &&
          relevantField !== null &&
          "data" in relevantField &&
          Array.isArray(relevantField.data) &&
          relevantField.data.some(
            (nestedItem) => nestedItem.attributes[nestedField] === value,
          )
        );
      }),
  );

  // search for the locale
  let itemsMatchingLocale = contentItems.filter(
    (item) => "locale" in item.attributes && item.attributes.locale == locale,
  );

  if (itemsMatchingLocale.length === 0) {
    // if the locale is not found, search for the default locale
    itemsMatchingLocale = contentItems.filter(
      (item) =>
        "locale" in item.attributes && item.attributes.locale == defaultLocale,
    );
  }

  return itemsMatchingLocale as StrapiFileContent[T];
};
