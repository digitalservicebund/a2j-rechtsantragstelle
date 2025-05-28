import { createContext, useContext } from "react";
import type { Translations } from "./getTranslationByKey";

type TranslationContext = {
  video: Translations;
  accessibility: Translations;
  fileUpload: Translations;
  accordion: Translations;
};

export const TranslationContext = createContext<TranslationContext>({
  video: {},
  accessibility: {},
  fileUpload: {},
  accordion: {},
});

export function useTranslations() {
  return useContext(TranslationContext);
}
