import type { Flow } from "~/domains/flows.server";
import type { UserData } from "~/domains/userData";
import { getArraySummaryPageTranslations } from "~/services/array/getArraySummaryPageTranslations";
import type { StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import type { Translations } from "~/services/translations/getTranslationByKey";
import { applyStringReplacement } from "~/util/applyStringReplacement";

type BuildFormularServerTranslations = {
  currentFlow: Flow;
  flowTranslations: Translations;
  migrationData: UserData | undefined;
  arrayCategories: string[];
  overviewTranslations: Translations;
  formPageContent: StrapiFormFlowPage;
  userDataWithPageData: UserData;
};

const structureCmsContent = (formPageContent: StrapiFormFlowPage) => {
  return {
    heading: "heading" in formPageContent ? formPageContent.heading : undefined,
    preHeading:
      "preHeading" in formPageContent ? formPageContent.preHeading : undefined,
    nextButtonLabel:
      "nextButtonLabel" in formPageContent
        ? formPageContent.nextButtonLabel
        : undefined,
    backButtonLabel:
      "backButtonLabel" in formPageContent
        ? formPageContent.backButtonLabel
        : undefined,
    content: formPageContent.pre_form,
    formContent: formPageContent.form,
    postFormContent:
      "post_form" in formPageContent ? formPageContent.post_form : [],
  };
};

function interpolateTranslations(
  currentFlow: Flow,
  translation: Translations,
  data: UserData | undefined,
): Translations {
  if (
    typeof data === "undefined" ||
    typeof currentFlow.stringReplacements === "undefined" ||
    typeof translation === "undefined"
  ) {
    return translation;
  }

  return applyStringReplacement(
    translation,
    currentFlow.stringReplacements(data),
  );
}

export const buildFormularServerTranslations = async ({
  currentFlow,
  flowTranslations,
  migrationData,
  arrayCategories,
  overviewTranslations,
  formPageContent,
  userDataWithPageData,
}: BuildFormularServerTranslations) => {
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

  const stringTranslations = {
    ...arrayTranslations,
    ...flowTranslationsAfterInterpolation,
    ...overviewTranslationsAfterInterpolation,
  };

  // structure cms content -> merge with getting data?
  const cmsContent = applyStringReplacement(
    structureCmsContent(formPageContent),
    typeof currentFlow.stringReplacements !== "undefined"
      ? {
          ...stringTranslations,
          ...currentFlow.stringReplacements(userDataWithPageData),
        }
      : {},
  );

  return {
    stringTranslations,
    cmsContent,
  };
};
