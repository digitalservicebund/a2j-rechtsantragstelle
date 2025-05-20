import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { translationsRaw } from "./translationsRaw";

type TranslationField = {
  id: number;
  name: string;
  value: string;
};

type Translation = {
  id: number;
  scope: string;
  locale: string;
  field: TranslationField[];
  createdAt: string;
  updatedAt: string;
  documentId: string;
  publishedAt: string;
};

export type TransformedTranslations = Record<
  string,
  Record<string, Record<string, string>>
>;

function transformTranslations(
  translations: Translation[],
): TransformedTranslations {
  return translations.reduce((result: TransformedTranslations, translation) => {
    const { scope, locale, field } = translation;

    if (!result[scope]) {
      result[scope] = {};
    }

    field.forEach((fieldItem) => {
      if (!result[scope][fieldItem.name]) {
        result[scope][fieldItem.name] = {};
      }
      result[scope][fieldItem.name][locale] = fieldItem.value;
    });

    return result;
  }, {});
}

const transformedTranslations = transformTranslations(translationsRaw);

try {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const outputPath = path.join(currentDir, "translations.ts");

  const fileContent = `// This file is auto-generated. Do not edit manually.
export const translations = ${JSON.stringify(transformedTranslations, null, 2)};
`;

  writeFileSync(outputPath, fileContent, "utf8");
  console.log(`Translations successfully written to ${outputPath}`);
} catch (error) {
  console.error("Error writing translations file:", error);
}
