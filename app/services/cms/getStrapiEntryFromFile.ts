/* eslint @typescript-eslint/require-await: 0 */
import fs from "node:fs";
import type {
  ApiId,
  StrapiSchemas,
  GetStrapiEntry,
  GetStrapiEntryOpts,
} from "./schemas";
import { config } from "../env/env.server";

let content: StrapiSchemas | undefined;

const NO_VALID_FILE =
  "No valid content.json found while using 'CMS=FILE'.\nEither run 'npm run build:localContent' or try another CMS source";
export const getStrapiEntryFromFile: GetStrapiEntry = async <T extends ApiId>(
  opts: GetStrapiEntryOpts<T>,
) => {
  if (!content) {
    try {
      const filePath = config().CONTENT_FILE_PATH;
      const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
      content = JSON.parse(fileContent);
    } catch (error) {
      throw Error(NO_VALID_FILE, { cause: error });
    }
  }

  if (!content || !content[opts.apiId]) {
    throw Error(NO_VALID_FILE, { cause: `content[opts.apiId] is not defined` });
  }

  const contentItems = [...content[opts.apiId]].filter(
    (content) =>
      !opts.filters ||
      opts.filters.every(({ field, value, nestedField }) => {
        const relevantField = (content as Record<string, unknown>)[field];
        if (!nestedField) {
          return Array.isArray(value)
            ? value.includes(relevantField as string)
            : relevantField === value;
        }

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
