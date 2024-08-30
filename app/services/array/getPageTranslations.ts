import { type Translations, fetchTranslations } from "../cms/index.server";

export async function getPageTranslations(
  arrayCategories: string[],
  flowId: string,
): Promise<Translations> {
  const translationsToFetch = [...arrayCategories, "arrayLabels", flowId];

  const categoryTranslationsArray = await Promise.all(
    translationsToFetch.map((category) => fetchTranslations(category)),
  );

  return Object.assign({}, ...categoryTranslationsArray);
}
