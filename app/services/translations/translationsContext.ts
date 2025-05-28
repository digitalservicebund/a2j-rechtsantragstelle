import { createContext, useContext } from "react";
import type { Translations } from "./getTranslationByKey";

type TranslationContext = {
  accessibility: Translations;
  fileUpload: Translations;
  accordion: Translations;
};

export const TranslationContext = createContext<TranslationContext>({
  accessibility: {},
  fileUpload: {},
  accordion: {},
});

export function useTranslations() {
  return useContext(TranslationContext);
}
