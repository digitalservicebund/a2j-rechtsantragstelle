import { getArraySummaryData } from "~/services/array/getArraySummaryData";
import { type CMSContent } from "~/services/flow/contentData/buildCmsContentAndTranslations";
import {
  type StepState,
  buildStepStatesFromStatusTree,
} from "~/services/navigation/buildStepStatesFromStatusTree";
import { navItemsFromStepStates } from "~/services/navigation/navItemsFromStepStates";
import { resolveUserData } from "~/services/session.server/resolveUserData";
import { type Translations } from "~/services/translations/getTranslationByKey";
import { translations as translationCode } from "~/services/translations/translations";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { buildFormElements } from "./buildFormElements";
import {
  navStateStepper,
  stateIsCurrent,
} from "~/services/navigation/navState";
import { type StepStepper } from "~/components/navigation/types";
import { getPageSchema } from "~/domains/pageSchemas";
import { generateSummaryFromUserData } from "~/services/summary/autoGenerateSummary";
import { type FlowId } from "~/domains/flowIds";
import { type UserDataWithPageData } from "../pageData";
import { type FlowSession } from "../flowEngine/createFlowSession";
import { type PageConfigMap } from "../flowEngine/types";
import { buildArrayConfigServer } from "~/services/array/buildArrayConfigServer";
import { getMetaConfigurationByStepId } from "../getMetaConfigurationByStepId";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { arrayIsNonEmpty } from "~/util/array";
import { EDIT_BUTTON_ID_PREFIX } from "~/services/array";

type ContentParameters = {
  cmsContent: CMSContent;
  translations: Translations;
};

function buildStepsStepper(
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

const getBackButtonDestination = (
  flowId: FlowId,
  flowSessionEngine: FlowSession<PageConfigMap>,
  arrayIndexes: number[] | undefined = [],
) => {
  const backDestination = flowSessionEngine.prevPath
    ? flowId +
      resolveArrayCharacter(flowSessionEngine.prevPath, arrayIndexes, false)
    : undefined;
  const arrayInfoNextStepId = flowSessionEngine.getArrayInfoByPath(
    flowSessionEngine.prevPath ?? "",
  );

  if (arrayIsNonEmpty(arrayIndexes) && arrayInfoNextStepId) {
    return `${backDestination}#${EDIT_BUTTON_ID_PREFIX}${arrayInfoNextStepId.name}-${arrayIndexes[0]}`;
  }

  return backDestination;
};

export const getContentData = (
  { cmsContent, translations }: ContentParameters,
  userDataWithPageData: UserDataWithPageData,
  pathname: string,
) => {
  return {
    arraySummaryData: (
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
    getFormElements: () => {
      return buildFormElements(cmsContent);
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
      flowId: FlowId,
      flowSessionEngine: FlowSession<PageConfigMap>,
      arrayIndexes: number[] | undefined = [],
    ) => {
      const buttonNavigationTranslation = translationCode.buttonNavigation;
      const backDestination = getBackButtonDestination(
        flowId,
        flowSessionEngine,
        arrayIndexes,
      );

      return getButtonNavigationProps({
        backButtonLabel:
          cmsContent.backButtonLabel ??
          buttonNavigationTranslation.backButtonDefaultLabel.de,
        nextButtonLabel:
          cmsContent.nextButtonLabel ??
          buttonNavigationTranslation.nextButtonDefaultLabel.de,
        isFinal: flowSessionEngine.isFinal,
        backDestination,
      });
    },
    getNavProps: (
      flowSessionEngine: FlowSession<PageConfigMap>,
      useStepper: boolean,
      userVisitedValidationPage: boolean,
    ) => {
      const { flowId, stepId, currentFlow } =
        getPageAndFlowDataFromPathname(pathname);

      const statusTree = flowSessionEngine.statusTree;
      const stepStates = buildStepStatesFromStatusTree(
        statusTree,
        flowId,
        flowSessionEngine.paths,
      );

      const expandAll = getMetaConfigurationByStepId(
        currentFlow,
        stepId,
      )?.triggerValidation;

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
    getAutoSummarySections: async (
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
      flowSessionEngine: FlowSession<PageConfigMap>,
      stepId: string,
    ) => {
      const progress = flowSessionEngine.getProgress(stepId);
      return {
        ...progress,
        label: translationCode.vorabcheck.progressBarLabel.de,
      };
    },
  };
};
