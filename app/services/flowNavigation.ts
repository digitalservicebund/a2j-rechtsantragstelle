import { NavState, type NavItem } from "~/components/FlowNavigation";
import type { FlowId, flowSpecifics } from "~/routes/shared/flowSpecifics";

export function navItemsFromFlowSpecifics(
  stepId: string,
  flowId: FlowId,
  currentFlow: (typeof flowSpecifics)[keyof typeof flowSpecifics],
): NavItem[] {
  return Object.entries(currentFlow.flow.states)
    .filter(([_, state]) => "states" in state)
    .map(([stateName, state]) => ({
      destination: `/${flowId}/${stateName}/${state.initial}`,
      label: stateName,
      state: stepId.includes(stateName) ? NavState.Current : NavState.Open,
    }));
}
