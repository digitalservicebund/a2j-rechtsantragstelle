import { lowercaseFirstLetter } from "../../util/strings.ts";

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
    .replaceAll(
      /[äöüÄÖÜß]/g,
      (match) => umlautMap[match as keyof typeof umlautMap],
    )
    .replaceAll(/[^\w]/g, "");
  return lowercaseFirstLetter(normalizedString);
}
