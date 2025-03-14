import { createContext, useContext } from "react";
import type { Translations } from "./getTranslationByKey";

type TranslationContext = {
  feedback: Translations;
  video: Translations;
  accessibility: Translations;
};

export const TranslationContext = createContext<TranslationContext>({
  feedback: {},
  video: {},
  accessibility: {},
});

export function useTranslations() {
  return useContext(TranslationContext);
}
