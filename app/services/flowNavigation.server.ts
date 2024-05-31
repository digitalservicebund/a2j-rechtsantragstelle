import type { NavItem } from "~/components/navigation/NavItem";
import { type Translations } from "./cms/index.server";
import { type StepState } from "./flow/server/buildFlowController";
import { NavState, stateIsCurrent } from "./navigation/navState";

function isStepStateIdCurrent(stepStateId: string, stepId: string) {
  // subflows might start with the same name, need to check the following char
  return stepId.includes(stepStateId + "/");
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
    const { isDone, isReachable, isUneditable, subStates } = stepState;

    const subNavItems = navItemsFromStepStates(stepId, subStates, translations);
    const isCurrent = subNavItems
      ? isSubflowCurrent(subNavItems)
      : isStepStateIdCurrent(stepState.stepId, stepId);

    return {
      destination: stepState.url,
      label: translations[stepState.stepId ?? ""] ?? stepState.stepId,
      subflows: subNavItems,
      state: navState({ isCurrent, isDone, isReachable, isUneditable }),
    };
  });
}

export function navState({
  isCurrent,
  isReachable,
  isDone,
  isUneditable,
}: {
  isCurrent: boolean;
  isReachable: boolean;
  isDone: boolean;
  isUneditable: boolean;
}) {
  if (isCurrent && isDone) return NavState.DoneCurrent;
  if (isCurrent) return NavState.Current;
  if (isUneditable && isDone) return NavState.DoneDisabled;
  if (isReachable && isDone) return NavState.Done;
  if (isReachable) return NavState.Open;

  return NavState.OpenDisabled;
}
