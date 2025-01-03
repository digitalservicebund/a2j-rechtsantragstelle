/* eslint @typescript-eslint/require-await: 0 */
import fs from "node:fs";
import type { GetStrapiEntryOpts } from "./filters";
import type { GetStrapiEntry } from "./getStrapiEntry";
import { strapiFileSchema, type ApiId, type StrapiSchemas } from "./schemas";
import { config } from "../env/env.server";

let content: StrapiSchemas | undefined;

export const getStrapiEntryFromFile: GetStrapiEntry = async <T extends ApiId>(
  opts: GetStrapiEntryOpts,
) => {
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
    (content) =>
      !opts.filters ||
      opts.filters.every(({ field, value, nestedField }) => {
        const relevantField = (content as Record<string, unknown>)[field];
        if (!nestedField) return relevantField === value;

        return (
          typeof relevantField === "object" &&
          relevantField !== null &&
          Array.isArray(relevantField) &&
          relevantField.some((nestedItem) => nestedItem[nestedField] === value)
        );
      }),
  );

  return contentItems.filter(
    (item) => "locale" in item && item.locale == opts.locale,
  ) as StrapiSchemas[T];
};
