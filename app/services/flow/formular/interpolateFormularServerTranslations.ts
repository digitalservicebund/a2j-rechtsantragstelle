import type { Context } from "~/domains/contexts";
import type { Flow } from "~/domains/flows.server";
import { getArraySummaryPageTranslations } from "~/services/array/getArraySummaryPageTranslations";
import type { Translations } from "~/services/translations/getTranslationByKey";
import { interpolateSerializableObject } from "~/util/fillTemplate";

function interpolateTranslations(
  currentFlow: Flow,
  translation: Translations,
  data: Context | undefined,
): Translations {
  if (
    typeof data === "undefined" ||
    typeof currentFlow.stringReplacements === "undefined" ||
    typeof translation === "undefined"
  ) {
    return translation;
  }

  return interpolateSerializableObject(
    translation,
    currentFlow.stringReplacements(data),
  );
}

export const interpolateFormularServerTranslations = async (
  currentFlow: Flow,
  flowTranslations: Translations,
  migrationData: Context | undefined,
  arrayCategories: string[],
  overviewTranslations: Translations,
  userDataWithPageData: Context,
) => {
  /* On the Fluggastrechte pages on the MigrationDataOverview data as airlines and airports
      can not be translated, so it's required to be interpolated
    */
  const flowTranslationsAfterInterpolation = interpolateTranslations(
    currentFlow,
    flowTranslations,
    migrationData,
  );

  /* On the Fluggastrechte pages on the Summary page data as airlines and airports
      can not be translated, so it's required to be interpolated
    */
  const overviewTranslationsAfterInterpolation = interpolateTranslations(
    currentFlow,
    overviewTranslations,
    userDataWithPageData,
  );

  const arrayTranslations =
    await getArraySummaryPageTranslations(arrayCategories);

  return {
    ...arrayTranslations,
    ...overviewTranslationsAfterInterpolation,
    ...flowTranslationsAfterInterpolation,
  };
};
