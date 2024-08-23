import { createContext, useContext } from "react";
import type { Translations } from "~/services/cms/index.server";

type VideoTranslationContext = {
  translations: Translations;
};

export const VideoTranslationContext = createContext<VideoTranslationContext>({
  translations: {},
});

export function useVideoTranslations(): VideoTranslationContext {
  return useContext(VideoTranslationContext);
}
