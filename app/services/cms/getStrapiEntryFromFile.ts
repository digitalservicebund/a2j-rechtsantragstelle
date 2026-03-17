import fs from "node:fs";
import type {
  ApiId,
  StrapiSchemas,
  GetStrapiEntry,
  GetStrapiEntryOpts,
} from "./schemas";
import { config } from "../env/env.server";

let content: StrapiSchemas | undefined;
let contentMtimeMs: number | undefined;

const NO_VALID_FILE =
  "No valid content.json found while using 'CMS=FILE'.\nEither run 'pnpm run build:localContent' or try another CMS source";

function readContentFile(filePath: string) {
  const fileStat = fs.statSync(filePath);

  if (content && contentMtimeMs === fileStat.mtimeMs) {
    return content;
  }

  const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
  content = JSON.parse(fileContent);
  contentMtimeMs = fileStat.mtimeMs;

  return content;
}

export const getStrapiEntryFromFile: GetStrapiEntry = async <T extends ApiId>(
  opts: GetStrapiEntryOpts<T>,
) => {
  try {
    const filePath = config().CONTENT_FILE_PATH;
    content = readContentFile(filePath);
  } catch (error) {
    throw new Error(NO_VALID_FILE, { cause: error });
  }

  if (!content?.[opts.apiId]) {
    throw new Error(NO_VALID_FILE, {
      cause: `content[opts.apiId] is not defined`,
    });
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
