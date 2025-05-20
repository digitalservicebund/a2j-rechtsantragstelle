type Lang = "de" | "en";

type TranslationRecord = Record<
  string,
  Record<string, Partial<Record<Lang, string>>>
>;

const trans: TranslationRecord = {
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

// trans.vorabcheck["bankkonten.kontostand"].de

// const umgekehrt = {
//     de: {

//     },
//     en: {

//     }
// }
