import type { Context } from "~/domains/contexts";
import type { Flow } from "~/domains/flows.server";
import { getArraySummaryPageTranslations } from "~/services/array/getArraySummaryPageTranslations";
import type { StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import type { Translations } from "~/services/translations/getTranslationByKey";
import { interpolateSerializableObject } from "~/util/fillTemplate";

type BuildFormularServerTranslations = {
  currentFlow: Flow;
  flowTranslations: Translations;
  migrationData: Context | undefined;
  arrayCategories: string[];
  overviewTranslations: Translations;
  formPageContent: StrapiFormFlowPage;
  userDataWithPageData: Context;
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

function getInterpolateFlowTranslations(
  currentFlow: Flow,
  flowTranslations: Translations,
  migrationData: Context | undefined,
): Translations {
  if (
    typeof migrationData === "undefined" ||
    typeof currentFlow.stringReplacements === "undefined"
  ) {
    return flowTranslations;
  }

  /* On the Fluggastrechte pages on the MigrationDataOverview data as airlines and airports
    can not be translated, so it's required to be interpolated
  */
  return interpolateSerializableObject(
    flowTranslations,
    currentFlow.stringReplacements(migrationData),
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
  const flowTranslationsAfterInterpolation = getInterpolateFlowTranslations(
    currentFlow,
    flowTranslations,
    migrationData,
  );

  const arrayTranslations =
    await getArraySummaryPageTranslations(arrayCategories);

  const stringTranslations = {
    ...arrayTranslations,
    ...flowTranslationsAfterInterpolation,
    ...overviewTranslations,
  };

  // structure cms content -> merge with getting data?
  const cmsContent = interpolateSerializableObject(
    structureCmsContent(formPageContent),
    typeof currentFlow.stringReplacements !== "undefined"
      ? currentFlow.stringReplacements(userDataWithPageData)
      : {},
  );

  return {
    stringTranslations,
    cmsContent,
  };
};
