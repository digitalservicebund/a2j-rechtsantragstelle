import { NavState, type NavItem } from "~/components/FlowNavigation";
import type { FlowId, flowSpecifics } from "~/routes/shared/flowSpecifics";
import { type buildFlowController } from "./flow/buildFlowController";

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
      const destination = `/${flowId}/${destinationStepId}`;

      let state = NavState.OpenDisabled;

      if (currentStepId.startsWith(rootStateName)) {
        state = NavState.Current;
      } else if (flowController.isReachable(destinationStepId)) {
        if (flowController.isDone(rootStateName)) {
          if (flowController.isUneditable(rootStateName)) {
            state = NavState.DoneDisabled;
          } else {
            state = NavState.Done;
          }
        } else {
          state = NavState.Open;
        }
      }

      return {
        destination,
        label: rootStateName,
        state,
      };
    });
}
