import { getArraySummaryData } from "~/services/array/getArraySummaryData";
import { type CMSContent } from "~/services/flow/formular/buildCmsContentAndTranslations";
import {
  type StepState,
  type buildFlowController,
} from "~/services/flow/server/buildFlowController";
import { navItemsFromStepStates } from "~/services/navigation/navItemsFromStepStates";
import { fieldsFromContext } from "~/services/session.server/fieldsFromContext";
import { type Translations } from "~/services/translations/getTranslationByKey";
import { translations as translationCode } from "~/services/translations/translations";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { buildFormElements } from "./buildFormElements";
import { getBackButtonDestination } from "./getBackButtonDestination";
import { type UserDataWithPageData } from "../../pageData";
import {
  navStateStepper,
  stateIsCurrent,
} from "~/services/navigation/navState";
import { type StepStepper } from "~/components/navigation/types";
import { getPageSchema } from "~/domains/pageSchemas";

type ContentParameters = {
  cmsContent: CMSContent;
  translations: Translations;
};

function buildStepsStepper(
  stepStates: StepState[],
  translations: Translations,
  flowController: ReturnType<typeof buildFlowController>,
  stepId: string,
  userVisitedValidationPage: boolean | undefined,
) {
  return stepStates
    .map((stepState) => ({
      label: translations[stepState.stepId] ?? stepState.stepId,
      href: flowController.getInitialSubState(stepState.stepId.substring(1)),
      navItems:
        navItemsFromStepStates(
          stepId,
          stepState.subStates,
          translations,
          userVisitedValidationPage,
        ) ?? [],
    }))
    .map((stepStepper) => ({
      ...stepStepper,
      state: navStateStepper(stepStepper.navItems.map(({ state }) => state)),
    }));
}

export const getContentData = (
  { cmsContent, translations }: ContentParameters,
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
    getFormElements: (pathname: string) => {
      return buildFormElements(cmsContent, userDataWithPageData, pathname);
    },
    getTranslations: () => {
      return translations;
    },
    getCMSContent: () => {
      return cmsContent;
    },
    getStepData: (pathname: string) => {
      const pageSchema = getPageSchema(pathname);
      const fieldNames = pageSchema ? Object.keys(pageSchema) : [];

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
      useStepper: boolean,
      userVisitedValidationPage?: boolean,
    ) => {
      const stepStates = flowController.stepStates(useStepper);
      const expandAll = flowController.getMeta(stepId)?.triggerValidation;

      if (!useStepper) {
        return {
          navItems:
            navItemsFromStepStates(
              stepId,
              stepStates,
              translations,
              userVisitedValidationPage,
            ) ?? [],
          stepsStepper: [],
          expandAll,
        };
      }

      const stepsStepper = buildStepsStepper(
        stepStates,
        translations,
        flowController,
        stepId,
        userVisitedValidationPage,
      );

      const currentNavItems =
        stepsStepper.find((stepStepper) => stateIsCurrent(stepStepper.state))
          ?.navItems ?? [];

      return {
        navItems: currentNavItems,
        stepsStepper: stepsStepper.map(({ href, label, state }) => ({
          label,
          href,
          state,
        })) as StepStepper[],
        expandAll,
      };
    },
  };
};
