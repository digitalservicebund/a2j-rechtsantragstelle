import { type NavItem } from "~/components/FlowNavigation";
import type { FlowId, flowSpecifics } from "~/routes/shared/flowSpecifics";
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
  flowId: FlowId,
  flowController: ReturnType<typeof buildFlowController>,
): NavItem[] {
  const currentFlow =
    flowController.getFlow() as (typeof flowSpecifics)[keyof typeof flowSpecifics]["flow"];
  return Object.entries(currentFlow.states)
    .filter(([_, state]) => "states" in state)
    .map(([rootStateName, rootState]) => {
      const destinationStepId = `${rootStateName}/${rootState.initial}`;

      return {
        destination: `/${flowId}/${destinationStepId}`,
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
