import { type TranslationRecord } from "./getTranslationByKey";
import { vorabcheckTranslations } from "./domains/vorabcheck";
import { resultPageTranslations } from "./domains/resultPage";
import { nachlassTranslations } from "./domains/nachlass";
import { componentsTranslations } from "./components";
import { geldEinklagenTranslations } from "./domains/geldEinklagen";
import { gerichtFinderTranslations } from "./domains/gerichtFinder";
import { commonTranslations } from "./common";
import { layoutTranslations } from "./layout";
import { pagesTranslations } from "./pages";

export const translations = {
  ...commonTranslations,
  ...componentsTranslations,
  ...geldEinklagenTranslations,
  ...gerichtFinderTranslations,
  ...nachlassTranslations,
  ...resultPageTranslations,
  ...vorabcheckTranslations,
  ...layoutTranslations,
  ...pagesTranslations,
} satisfies TranslationRecord;
