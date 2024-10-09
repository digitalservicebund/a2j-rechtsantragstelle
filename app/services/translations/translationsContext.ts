import { createContext, useContext } from "react";
import type { Translations } from "~/services/cms/index.server";

type TranslationContext = {
  feedback: Translations;
  video: Translations;
};

export const TranslationContext = createContext<TranslationContext>({
  feedback: {},
  video: {},
});

export function useTranslations(): TranslationContext {
  return useContext(TranslationContext);
}
