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
  return propertyName
    .replace(
      /[äöüÄÖÜß]/g,
      (match) => umlautMap[match as keyof typeof umlautMap],
    )
    .replace(/[^a-zA-Z0-9]/g, "");
}
