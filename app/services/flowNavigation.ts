import { type NavItem } from "~/components/FlowNavigation";
import type { FlowSpecifics } from "~/routes/shared/flowSpecifics";
import { type buildFlowController } from "./flow/buildFlowController";

export enum NavState {
  DoneDisabled,
  Done,
  Current,
  Open,
  OpenDisabled,
}

export function navItemsFromFlowSpecifics(
  currentStepId: string,
  flowController: ReturnType<typeof buildFlowController>,
): NavItem[] {
  const currentFlow =
    flowController.getFlow() as FlowSpecifics[keyof FlowSpecifics]["flow"];

  return Object.entries(currentFlow.states)
    .filter(([_, state]) => "states" in state)
    .map(([rootStateName, rootState]) => {
      const destinationStepId = `${rootStateName}/${rootState.initial}`;
      const pathPrefix = currentStepId.includes("/") ? ".." : "."; // account for both nested and non-nested steps
      return {
        destination: `${pathPrefix}/${destinationStepId}`,
        label: rootStateName,
        state: navState({
          isCurrent: currentStepId.startsWith(rootStateName),
          isReachable: flowController.isReachable(destinationStepId),
          isDone: flowController.isDone(rootStateName),
          isUneditable: flowController.isUneditable(rootStateName),
        }),
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
