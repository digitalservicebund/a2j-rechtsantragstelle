import { NavState, type NavItem } from "~/components/FlowNavigation";
import type { FlowId, flowSpecifics } from "~/routes/shared/flowSpecifics";

export function navItemsFromFlowSpecifics(
  stepId: string,
  flowId: FlowId,
  currentFlow: (typeof flowSpecifics)[keyof typeof flowSpecifics],
): NavItem[] {
  return Object.entries(currentFlow.flow.states).map(([stateName, state]) => ({
    destination:
      "states" in state
        ? `/${flowId}/${stateName}/${state.initial}`
        : `/${flowId}/${stateName}`,
    label: stateName,
    state:
      "states" in state
        ? stepId.includes(stateName)
          ? NavState.Current
          : NavState.Open
        : stepId === stateName
          ? NavState.Current
          : NavState.Open,
  }));
}
