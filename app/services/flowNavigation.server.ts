import { type NavItem } from "~/components/navigation/types";
import { type StepState } from "./flow/server/buildFlowController";
import { navState, stateIsCurrent } from "./navigation/navState";
import type { Translations } from "./translations/getTranslationByKey";
import { isStepStateIdCurrent } from "./navigation/isStepStateIdCurrent";

function isSubflowCurrent(subflows: NavItem[]) {
  return subflows.some((subflow) => stateIsCurrent(subflow.state));
}

export function navItemsFromStepStates(
  stepId: string,
  stepStates: StepState[] | undefined,
  translations: Translations = {},
): NavItem[] | undefined {
  if (!stepStates) return undefined;

  return stepStates.map((stepState) => {
    const { isDone, isReachable, subStates } = stepState;

    const subNavItems = navItemsFromStepStates(stepId, subStates, translations);
    const isCurrent = subNavItems
      ? isSubflowCurrent(subNavItems)
      : isStepStateIdCurrent(stepState.stepId, stepId);

    return {
      destination: stepState.url,
      label: translations[stepState.stepId] ?? stepState.stepId,
      subflows: subNavItems,
      state: navState({ isCurrent, isDone, isReachable }),
      excludedFromValidation: stepState.excludedFromValidation,
    };
  });
}
