import { type Flow } from "~/domains/flows.server";
import { getArraySummaryData } from "~/services/array/getArraySummaryData";
import { getFieldsByFormElements } from "~/services/cms/getFieldsByFormElements";
import { type StrapiMeta } from "~/services/cms/models/StrapiMeta";
import { type CMSContent } from "~/services/flow/formular/buildCmsContentAndTranslations";
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
  parentMeta: StrapiMeta | null;
  translations: Translations;
};

export const getContentData = (
  { cmsContent, parentMeta, translations }: ContentParameters,
  userDataWithPageData: UserDataWithPageData,
  currentFlow: Flow,
) => {
  return {
    arraySummaryData: (
      flowController: ReturnType<typeof buildFlowController>,
    ) => {
      const arrayCategories = cmsContent.content
        .filter((value) => value.__component === "page.array-summary")
        .map((arraySummary) => arraySummary.category);

      return getArraySummaryData(
        arrayCategories,
        flowController.getRootMeta()?.arrays,
        userDataWithPageData,
        cmsContent.content,
      );
    },
    getFormElements: () => {
      return buildFormElements(cmsContent, userDataWithPageData);
    },
    getMeta: () => {
      return buildMetaContent(
        currentFlow,
        cmsContent.pageMeta,
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
      const fieldNames = getFieldsByFormElements(cmsContent.formContent);
      return fieldsFromContext(userDataWithPageData, fieldNames);
    },
    getButtonNavigation: (
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
    getNavProps: (
      flowController: ReturnType<typeof buildFlowController>,
      stepId: string,
    ) => {
      const useStepper = currentFlow.useStepper ?? false;
      const steps = flowController.stepStates();
      const steppers = useStepper
        ? steps
            .filter((s) => s.isMainStep)
            .map((s) => ({
              stepId: s.stepId,
              url: flowController.getInitialSubState(s.stepId.substring(1)),
            }))
        : undefined;

      return {
        steppers,
        navItems:
          navItemsFromStepStates(stepId, steps, translations, useStepper) ?? [],
        expandAll: flowController.getMeta(stepId)?.triggerValidation,
      };
    },
  };
};
