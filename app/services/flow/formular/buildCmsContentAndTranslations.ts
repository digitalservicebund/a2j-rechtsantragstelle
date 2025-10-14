import type { StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import type { StrapiMeta } from "~/services/cms/models/StrapiMeta";
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
  parentMeta: StrapiMeta | null;
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

export const buildCmsContentAndTranslations = ({
  flowTranslations,
  flowMenuTranslations,
  overviewTranslations,
  formPageContent,
  replacements,
  parentMeta,
}: BuildCmsContentAndTranslations): {
  translations: Translations;
  cmsContent: CMSContent;
} => {
  const translationsAfterInterpolation = {
    ...applyStringReplacement(flowTranslations, replacements), // interpolate data on MigrationDataOverview
    ...applyStringReplacement(overviewTranslations, replacements), // interpolate data on Summary page
    ...flowMenuTranslations,
  };

  // structure cms content -> merge with getting data?
  const cmsContent = applyStringReplacement(
    structureCmsContent({
      ...formPageContent,
      pageTitle: composePageTitle(formPageContent.pageTitle, parentMeta),
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
