import type { Context } from "~/domains/contexts";
import type { Flow } from "~/domains/flows.server";
import type { StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import type { Translations } from "~/services/translations/getTranslationByKey";
import { interpolateSerializableObject } from "~/util/fillTemplate";
import { interpolateFormularServerTranslations } from "./interpolateFormularServerTranslations";

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

export const buildFormularServerTranslations = async ({
  currentFlow,
  flowTranslations,
  migrationData,
  arrayCategories,
  overviewTranslations,
  formPageContent,
  userDataWithPageData,
}: BuildFormularServerTranslations) => {
  const stringTranslations = await interpolateFormularServerTranslations(
    currentFlow,
    flowTranslations,
    migrationData,
    arrayCategories,
    overviewTranslations,
    userDataWithPageData,
  );

  // structure cms content -> merge with getting data?
  const cmsContent = interpolateSerializableObject(
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
