import { type NavItem } from "~/components/FlowNavigation";
import {
  getSubflowsEntries,
  type FlowSpecifics,
} from "~/routes/shared/flowSpecifics";
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
  labels?: Record<string, string>,
): NavItem[] {
  const currentFlow =
    flowController.getFlow() as FlowSpecifics[keyof FlowSpecifics]["flow"];

  return getSubflowsEntries(currentFlow).map(([rootStateName, { initial }]) => {
    const destinationStepId = `${rootStateName}/${
      typeof initial === "string" ? initial : ""
    }`;
    const pathPrefix = currentStepId.includes("/") ? ".." : "."; // account for both nested and non-nested steps
    const label =
      labels && rootStateName in labels ? labels[rootStateName] : rootStateName;
    return {
      destination: `${pathPrefix}/${destinationStepId}`,
      label,
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
