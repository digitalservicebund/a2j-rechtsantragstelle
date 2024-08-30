import { lowercaseFirstLetter } from "~/util/strings";

const umlautMap = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  Ä: "Ae",
  Ö: "Oe",
  Ü: "Ue",
  ß: "ss",
} as const;

export function normalizePropertyName(propertyName: string) {
  const normalizedString = propertyName
    .replace(
      /[äöüÄÖÜß]/g,
      (match) => umlautMap[match as keyof typeof umlautMap],
    )
    .replace(/[^\w]/g, "");
  return lowercaseFirstLetter(normalizedString);
}
