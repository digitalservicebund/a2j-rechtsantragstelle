import { getArraySummaryData } from "~/services/array/getArraySummaryData";
import { getFieldsByFormElements } from "~/services/cms/getFieldsByFormElements";
import { type CMSContent } from "~/services/flow/formular/buildCmsContentAndTranslations";
import { type buildFlowController } from "~/services/flow/server/buildFlowController";
import { navItemsFromStepStates } from "~/services/flowNavigation.server";
import { fieldsFromContext } from "~/services/session.server/fieldsFromContext";
import { type Translations } from "~/services/translations/getTranslationByKey";
import { translations as translationCode } from "~/services/translations/translations";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { buildFormElements } from "./buildFormElements";
import { getBackButtonDestination } from "./getBackButtonDestination";
import { type UserDataWithPageData } from "../../pageData";
import type { stepMeta } from "~/services/meta/stepMeta";
import { Flow } from "~/domains/flows.server";

type ContentParameters = {
  cmsContent: CMSContent;
  translations: Translations;
  meta: ReturnType<typeof stepMeta>;
  currentFlow: Flow;
};

export const getContentData = (
  { cmsContent, translations, meta, currentFlow }: ContentParameters,
  userDataWithPageData: UserDataWithPageData,
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
    getMeta: () => meta,
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
      const stepStates = flowController.stepStates(
        currentFlow.useStepper ?? false,
      );

      const steps = currentFlow.useStepper
        ? stepStates
            .filter((s) =>
              s.subStates?.some((subState) => subState.stepId === stepId),
            )
            .flatMap((s) => s.subStates ?? [])
        : stepStates;

      return {
        navItems: navItemsFromStepStates(stepId, steps, translations) ?? [],
        expandAll: flowController.getMeta(stepId)?.triggerValidation,
      };
    },
  };
};
