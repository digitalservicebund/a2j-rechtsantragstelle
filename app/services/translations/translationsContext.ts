import { createContext, useContext } from "react";
import type { Translations } from "./getTranslationByKey";

type TranslationContext = {
  accessibility: Translations;
};

export const TranslationContext = createContext<TranslationContext>({
  accessibility: {},
});

export function useTranslations() {
  return useContext(TranslationContext);
}
