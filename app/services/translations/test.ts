type Lang = "de" | "en";

type TranslationRecord = Record<
  string,
  Record<string, Partial<Record<Lang, string>>>
>;

export const translations: TranslationRecord = {
  vorabcheck: {
    ["bankkonten.blah"]: {
      de: "Kontostand (in Euro)",
    },
    ["bankkonten.kontostand"]: {
      de: "Kontostand (in Euro)",
      en: "",
    },
  },
};
