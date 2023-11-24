import { NavState, type NavItem } from "~/components/FlowNavigation";
import type { FlowId, flowSpecifics } from "~/routes/shared/flowSpecifics";
import { type buildFlowController } from "./flow/buildFlowController";

export function navItemsFromFlowSpecifics(
  stepId: string,
  flowId: FlowId,
  flowController: ReturnType<typeof buildFlowController>,
): NavItem[] {
  const currentFlow =
    flowController.getFlow() as (typeof flowSpecifics)[keyof typeof flowSpecifics]["flow"];
  return Object.entries(currentFlow.states)
    .filter(([_, state]) => "states" in state)
    .map(([stateName, state]) => {
      const destinationStepId = `${stateName}/${state.initial}`;
      const destination = `/${flowId}/${destinationStepId}`;
      const isReachable = flowController.isReachable(destinationStepId);
      const isSingleRun =
        "meta" in state && "singleRun" in state.meta && state.meta.singleRun;

      return {
        destination,
        label: stateName,
        state: stepId.includes(stateName)
          ? NavState.Current
          : isReachable
            ? isSingleRun
              ? NavState.DoneDisabled
              : NavState.Open
            : NavState.OpenDisabled,
      };
    });
}
