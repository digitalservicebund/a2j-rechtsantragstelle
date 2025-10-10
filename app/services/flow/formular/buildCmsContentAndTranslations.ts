import type { FlowId } from "~/domains/flowIds";
import type { StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import { composePageTitle } from "~/services/meta/composePageTitle";
import type { Translations } from "~/services/translations/getTranslationByKey";
import {
  applyStringReplacement,
  type Replacements,
} from "~/util/applyStringReplacement";

type BuildCmsContentAndTranslations = {
  flowTranslations: Translations;
  flowMenuTranslations: Translations;
  overviewTranslations: Translations;
  formPageContent: StrapiFormFlowPage;
  replacements?: Replacements;
  flowId: FlowId;
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
    pageTitle: formPageContent.pageTitle,
  };
};

export type CMSContent = ReturnType<typeof structureCmsContent>;

export const buildCmsContentAndTranslations = async ({
  flowTranslations,
  flowMenuTranslations,
  overviewTranslations,
  formPageContent,
  replacements,
  flowId,
}: BuildCmsContentAndTranslations): Promise<{
  translations: Translations;
  cmsContent: CMSContent;
}> => {
  const translationsAfterInterpolation = {
    ...applyStringReplacement(flowTranslations, replacements), // interpolate data on MigrationDataOverview
    ...applyStringReplacement(overviewTranslations, replacements), // interpolate data on Summary page
    ...flowMenuTranslations,
  };

  // structure cms content -> merge with getting data?
  const cmsContent = applyStringReplacement(
    structureCmsContent({
      ...formPageContent,
      pageTitle: await composePageTitle(formPageContent.pageTitle, flowId),
    }),
    {
      ...translationsAfterInterpolation,
      ...replacements,
    },
    true, // skip indexArray replacement as it will be handled in the component
  );

  return {
    translations: translationsAfterInterpolation,
    cmsContent,
  };
};
