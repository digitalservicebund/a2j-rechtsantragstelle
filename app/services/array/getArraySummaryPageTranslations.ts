import { fetchTranslations } from "../cms/index.server";
import type { Translations } from "../translations/getTranslationByKey";

export async function getArraySummaryPageTranslations(
  arrayCategories: string[],
): Promise<Translations> {
  const translationsToFetch = [...arrayCategories, "arrayLabels"];

  const categoryTranslationsArray = await Promise.all(
    translationsToFetch.map((category) => fetchTranslations(category)),
  );

  return Object.assign({}, ...categoryTranslationsArray);
}
