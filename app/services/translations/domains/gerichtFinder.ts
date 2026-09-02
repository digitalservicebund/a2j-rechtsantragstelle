import { type TranslationRecord } from "../getTranslationByKey";

export const gerichtFinderTranslations = {
  gerichtFinder: {
    finder: {
      de: "Amtsgericht finden",
    },
    noResultsFound: {
      de: "Kein Eintrag gefunden",
    },
    inputRequired: {
      de: "Dieses Feld muss ausgefüllt werden.",
    },
    invalidHousenumber: {
      de: "Bitte geben Sie eine gültige Hausnummer an.",
    },
    addressHelperText: {
      de: "Geben Sie bitte Ihre genaue Straße und Hausnummer ein",
    },
    autosuggestInputHelperText: {
      de: "Geben Sie Ihre Straße ein und wählen Sie diese anschließend aus der Trefferliste aus",
    },
  },
} satisfies TranslationRecord;
