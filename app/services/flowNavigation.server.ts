import { type NavItem } from "~/components/navigation/types";
import { type StepState } from "./flow/server/buildFlowController";
import { type NavState, stateIsCurrent } from "./navigation/navState";
import type { Translations } from "./translations/getTranslationByKey";

function isStepStateIdCurrent(stepStateId: string, stepId: string) {
  // subflows might start with the same name, need to check the following char
  return stepId.startsWith(stepStateId + "/");
}

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
    };
  });
}

export function navState({
  isCurrent,
  isReachable,
  isDone,
}: {
  isCurrent: boolean;
  isReachable: boolean;
  isDone: boolean;
}): NavState {
  if (isCurrent && isDone) return "DoneCurrent";
  if (isCurrent) return "Current";
  if (isReachable && isDone) return "Done";
  if (isReachable) return "Open";

  return "Disabled";
}
