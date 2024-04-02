import { NavState, type NavItem } from "~/components/FlowNavigation";
import { type DoneState } from "./flow/server/buildFlowController";
import { type Translations } from "./cms/index.server";

function isDoneStateIdCurrent(doneStateId: string, stepId: string) {
  // subflows might start with the same name, nee to check the following char
  return stepId.includes(doneStateId) && stepId.at(doneStateId.length) === "/";
}

function isSubflowCurrent(subflows: NavItem[]) {
  return subflows.some((state) => state.state === NavState.Current);
}

export function navItemsFromDoneStates(
  stepId: string,
  doneStates: DoneState[] | undefined,
  translations: Translations,
): NavItem[] | undefined {
  if (!doneStates) return undefined;

  return doneStates.map((doneState) => {
    const { isDone, isReachable, isUneditable, subStates } = doneState;

    const subNavItems = navItemsFromDoneStates(stepId, subStates, translations);
    const isCurrent = subNavItems
      ? isSubflowCurrent(subNavItems)
      : isDoneStateIdCurrent(doneState.stepId, stepId);

    return {
      destination: doneState.url,
      label: translations[doneState.stepId ?? ""] ?? doneState.stepId,
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
  if (isCurrent) return NavState.Current;
  if (isUneditable && isDone) return NavState.DoneDisabled;
  if (isReachable && isDone) return NavState.Done;
  if (isReachable) return NavState.Open;

  return NavState.OpenDisabled;
}
