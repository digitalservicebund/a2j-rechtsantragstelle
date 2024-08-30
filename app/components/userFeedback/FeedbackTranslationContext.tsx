import { createContext, useContext } from "react";
import type { Translations } from "~/services/cms/index.server";

type FeedbackTranslationsContext = {
  translations: Translations;
};

export const FeedbackTranslationContext =
  createContext<FeedbackTranslationsContext>({ translations: {} });

export function useFeedbackTranslations(): FeedbackTranslationsContext {
  return useContext(FeedbackTranslationContext);
}
