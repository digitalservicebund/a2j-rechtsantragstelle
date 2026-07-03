import { getArraySummaryData } from "~/services/array/getArraySummaryData";
import { type CMSContent } from "~/services/flow/contentData/buildCmsContentAndTranslations";
import {
  type StepState,
  type buildFlowController,
} from "~/services/flow/server/buildFlowController";
import { navItemsFromStepStates } from "~/services/navigation/navItemsFromStepStates";
import { resolveUserData } from "~/services/session.server/resolveUserData";
import { type Translations } from "~/services/translations/getTranslationByKey";
import { translations as translationCode } from "~/services/translations/translations";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { buildFormElements } from "./buildFormElements";
import { getBackButtonDestination } from "./getBackButtonDestination";
import {
  navStateStepper,
  stateIsCurrent,
} from "~/services/navigation/navState";
import { type StepStepper } from "~/components/navigation/types";
import { getPageSchema } from "~/domains/pageSchemas";
import { generateSummaryFromUserData } from "~/services/summary/autoGenerateSummary";
import { type FlowId } from "~/domains/flowIds";
import { type UserDataWithPageData } from "../pageData";
import { type FlowSession } from "../newFlowEngine/createFlowSession";
import { buildStepStatesFromStatusTree } from "~/services/navigation/buildStepStatesFromStatusTree";
import { type PageConfigMap } from "../newFlowEngine/types";
import { buildArrayConfigServer } from "~/services/array/buildArrayConfigServer";

type ContentParameters = {
  cmsContent: CMSContent;
  translations: Translations;
};

function buildStepsStepperNewEngine(
  stepStates: StepState[],
  translations: Translations,
  stepId: string,
  userVisitedValidationPage: boolean,
) {
  return stepStates
    .map((stepState) => ({
      label: translations[stepState.stepId] ?? stepState.stepId,
      href: stepState.url,
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
  pathname: string,
) => {
  return {
    arraySummaryDataNewEngine: (
      flowSessionEngine: FlowSession<PageConfigMap>,
      flowId: FlowId,
    ) => {
      const arrayCategories = cmsContent.content
        .filter((value) => value.__component === "page.array-summary")
        .map((arraySummary) => arraySummary.category);

      const arrayConfigurations = buildArrayConfigServer(
        flowSessionEngine,
        flowId,
      );

      return getArraySummaryData(
        arrayCategories,
        arrayConfigurations,
        userDataWithPageData,
        cmsContent.content,
      );
    },
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
    getFormElements: (flowId: FlowId) => {
      return buildFormElements(cmsContent, userDataWithPageData, flowId);
    },
    getTranslations: () => {
      return translations;
    },
    getCMSContent: () => {
      return cmsContent;
    },
    getStepData: () => {
      const pageSchema = getPageSchema(pathname);
      const fieldNames = pageSchema ? Object.keys(pageSchema) : [];

      return resolveUserData(userDataWithPageData, fieldNames);
    },
    getButtonNavigation: (
      flowController: ReturnType<typeof buildFlowController>,
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
    getButtonNavigationNewEngine: (
      flowId: FlowId,
      flowSessionEngine: FlowSession<PageConfigMap>,
      arrayIndexes: number[] | undefined = [],
    ) => {
      const buttonNavigationTranslation = translationCode.buttonNavigation;
      const backDestination = flowSessionEngine.prevPath
        ? flowId + flowSessionEngine.prevPath
        : undefined;

      return getButtonNavigationProps({
        backButtonLabel:
          cmsContent.backButtonLabel ??
          buttonNavigationTranslation.backButtonDefaultLabel.de,
        nextButtonLabel:
          cmsContent.nextButtonLabel ??
          buttonNavigationTranslation.nextButtonDefaultLabel.de,
        isFinal: flowSessionEngine.isFinal,
        backDestination: getBackButtonDestination(
          backDestination,
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
    getNavPropsNewEngine: (
      flowId: FlowId,
      flowSessionEngine: FlowSession<PageConfigMap>,
      useStepper: boolean,
      stepId: string,
      userVisitedValidationPage: boolean,
    ) => {
      const statusTree = flowSessionEngine.statusTree;
      const stepStates = buildStepStatesFromStatusTree(
        statusTree,
        flowId,
        flowSessionEngine.paths,
      );

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
          expandAll: false,
        };
      }

      const stepsStepper = buildStepsStepperNewEngine(
        stepStates,
        translations,
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
        expandAll: false,
      };
    },
    getAutoSummarySections: async (
      flowController: ReturnType<typeof buildFlowController>,
      flowId: FlowId,
    ) => {
      if (!pathname.endsWith("/abgabe/zusammenfassung")) {
        return [];
      }

      const stepStates = flowController.stepStates();
      return await generateSummaryFromUserData(
        userDataWithPageData,
        flowId,
        stepStates,
        translations,
      );
    },
    getAutoSummarySectionsNewEngine: async (
      flowSessionEngine: FlowSession<PageConfigMap>,
      flowId: FlowId,
    ) => {
      if (!pathname.endsWith("/abgabe/zusammenfassung")) {
        return [];
      }
      const statusTree = flowSessionEngine.statusTree;
      const stepStates = buildStepStatesFromStatusTree(
        statusTree,
        flowId,
        flowSessionEngine.paths,
      );
      return await generateSummaryFromUserData(
        userDataWithPageData,
        flowId,
        stepStates,
        translations,
      );
    },
    getProgress: (
      flowController: ReturnType<typeof buildFlowController>,
      stepId: string,
    ) => {
      const progress = flowController.getProgress(stepId);
      return {
        ...progress,
        label: translationCode.vorabcheck.progressBarLabel.de,
      };
    },
  };
};
