import { createInstance } from "i18next";
import germanTranslation from "~/translations/de.json";
import englishTranslation from "~/translations/en.json";

const i18n = createInstance({
  fallbackLng: "de",
  debug: false,

  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },

  resources: {
    en: englishTranslation,
    de: germanTranslation,
  },
});

await i18n.init();

export default i18n;
