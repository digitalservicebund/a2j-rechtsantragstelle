import { type Flow } from "~/domains/flows.server";
import { getArraySummaryData } from "~/services/array/getArraySummaryData";
import { type StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import { type StrapiMeta } from "~/services/cms/models/StrapiMeta";
import { type CMSContent } from "~/services/flow/formular/buildFormularServerTranslations";
import { type buildFlowController } from "~/services/flow/server/buildFlowController";
import { navItemsFromStepStates } from "~/services/flowNavigation.server";
import { fieldsFromContext } from "~/services/session.server/fieldsFromContext";
import { type Translations } from "~/services/translations/getTranslationByKey";
import { translations as translationCode } from "~/services/translations/translations";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { buildFormElements } from "./buildFormElements";
import { buildMetaContent } from "./buildMetaContent";
import { getBackButtonDestination } from "./getBackButtonDestination";
import { type UserDataWithPageData } from "../../pageData";

type ContentParameters = {
  cmsContent: CMSContent;
  formPageContent: StrapiFormFlowPage;
  parentMeta: StrapiMeta | null;
  translations: Translations;
};

export const getContentData = (
  { cmsContent, formPageContent, parentMeta, translations }: ContentParameters,
  userDataWithPageData: UserDataWithPageData,
  currentFlow: Flow,
  arrayCategories: string[],
) => {
  return {
    arraySummaryData: (
      flowController: ReturnType<typeof buildFlowController>,
    ) => {
      return getArraySummaryData(
        arrayCategories,
        flowController.getRootMeta()?.arrays,
        userDataWithPageData,
      );
    },
    getFormElements: () => {
      return buildFormElements(cmsContent);
    },
    getMeta: () => {
      return buildMetaContent(
        currentFlow,
        formPageContent.pageMeta,
        parentMeta,
        userDataWithPageData,
      );
    },
    getTranslations: () => {
      return translations;
    },
    getCMSContent: () => {
      return cmsContent;
    },
    getStepData: () => {
      const fieldNames = cmsContent.formContent.map((entry) => entry.name);
      return fieldsFromContext(userDataWithPageData, fieldNames);
    },
    getButtonNavigationProps: (
      flowController: ReturnType<typeof buildFlowController>,
      pathname: string,
      stepId: string,
      arrayIndexes: number[] | undefined = [],
    ) => {
      const buttonNavigationTranslation = translationCode.buttonNavigation;

      return getButtonNavigationProps({
        backButtonLabel:
          cmsContent.backButtonLabel ??
          buttonNavigationTranslation.backButtonDefaultLabel.de,
        nextButtonLabel:
          cmsContent.nextButtonLabel ??
          buttonNavigationTranslation.nextButtonDefaultLabel.de,
        isFinal: flowController.isFinal(stepId),
        backDestination: getBackButtonDestination(
          flowController.getPrevious(stepId),
          pathname,
          arrayIndexes,
        ),
      });
    },
    getNavItems: (
      flowController: ReturnType<typeof buildFlowController>,
      stepId: string,
    ) => {
      return (
        navItemsFromStepStates(
          stepId,
          flowController.stepStates(),
          translations,
        ) ?? []
      );
    },
  };
};
