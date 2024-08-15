import { fetchTranslations, Translations } from "../cms/index.server";

export async function getArrayCategoryTranslations(
  arrayCategories: string[],
): Promise<Translations> {
  const categoryTranslationsArray = await Promise.all([
    ...arrayCategories.map((category) => fetchTranslations(category)),
    fetchTranslations("arrayLabels"),
  ]);

  return Object.assign({}, ...categoryTranslationsArray);
}
