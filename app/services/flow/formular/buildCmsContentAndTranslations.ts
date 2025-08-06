import type { Flow } from "~/domains/flows.server";
import type { UserData } from "~/domains/userData";
import type { StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import type { Translations } from "~/services/translations/getTranslationByKey";
import { applyStringReplacement } from "~/util/applyStringReplacement";

type BuildCmsContentAndTranslations = {
  currentFlow: Flow;
  flowTranslations: Translations;
  flowMenuTranslations: Translations;
  migrationData: UserData | undefined;
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
    pageMeta: formPageContent.pageMeta,
  };
};

export type CMSContent = ReturnType<typeof structureCmsContent>;

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

export const buildCmsContentAndTranslations = ({
  currentFlow,
  flowTranslations,
  flowMenuTranslations,
  migrationData,
  overviewTranslations,
  formPageContent,
  userDataWithPageData,
}: BuildCmsContentAndTranslations): {
  translations: Translations;
  cmsContent: CMSContent;
} => {
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

  const translationsAfterInterpolation = {
    ...flowTranslationsAfterInterpolation,
    ...overviewTranslationsAfterInterpolation,
    ...flowMenuTranslations,
  };

  // structure cms content -> merge with getting data?
  const cmsContent = applyStringReplacement(
    structureCmsContent(formPageContent),
    typeof currentFlow.stringReplacements !== "undefined"
      ? {
          ...translationsAfterInterpolation,
          ...currentFlow.stringReplacements(userDataWithPageData),
        }
      : {},
    true, // skip indexArray replacement as it will be handled in the component
  );

  return {
    translations: translationsAfterInterpolation,
    cmsContent,
  };
};
