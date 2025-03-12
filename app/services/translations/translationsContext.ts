import { createContext, useContext } from "react";
import type { Translations } from "./getTranslationByKey";

type TranslationContext = {
  feedback: Translations;
  video: Translations;
  accessibility: Translations;
  fileUpload: Translations;
};

export const TranslationContext = createContext<Partial<TranslationContext>>({
  feedback: {},
  video: {},
  accessibility: {},
  fileUpload: {},
});

export function useTranslations() {
  return useContext(TranslationContext);
}
