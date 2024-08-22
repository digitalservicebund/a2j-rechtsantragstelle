/* eslint @typescript-eslint/require-await: 0 */
import fs from "node:fs";
import type { GetStrapiEntryOpts } from "./filters";
import type { GetStrapiEntry } from "./getStrapiEntry";
import { defaultLocale, stagingLocale } from "./models/StrapiLocale";
import { strapiFileSchema, type ApiId, type StrapiSchemas } from "./schemas";
import { config } from "../env/env.server";

let content: StrapiSchemas | undefined;

export const getStrapiEntryFromFile: GetStrapiEntry = async <T extends ApiId>({
  locale = config().ENVIRONMENT != "production" ? stagingLocale : defaultLocale,
  ...opts
}: GetStrapiEntryOpts) => {
  if (!content) {
    try {
      const filePath = config().CONTENT_FILE_PATH;
      const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
      content = strapiFileSchema.parse(JSON.parse(fileContent));
    } catch (error) {
      throw Error(
        "No valid content.json found while using 'CMS=FILE'.\nEither run 'npm run build:localContent' or try another CMS source",
        { cause: error },
      );
    }
  }

  const contentItems = [...content[opts.apiId]].filter(
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
  let contentItem = contentItems.filter(
    (item) => "locale" in item.attributes && item.attributes.locale == locale,
  );

  if (contentItem.length === 0) {
    // if the locale is not found, search for the default locale
    contentItem = contentItems.filter(
      (item) =>
        "locale" in item.attributes && item.attributes.locale == defaultLocale,
    );
  }

  return contentItem as StrapiSchemas[T];
};
