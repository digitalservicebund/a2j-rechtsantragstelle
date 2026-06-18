import { type FlowId } from "~/domains/flowIds";
import { type StepState } from "../flow/server/buildFlowController";
import { type StatusNode } from "../flow/newFlowEngine/statusTree";

export function buildStepStatesFromStatusTree(
  statusTree: Record<string, StatusNode>,
  flowId: FlowId,
): StepState[] {
  const toStepStates = (
    nodes: Record<string, StatusNode>,
    parentPath = "",
  ): StepState[] => {
    return Object.entries(nodes).map(([pathSegment, node]) => {
      const fullPath = `${parentPath}${pathSegment}`;

      const nodeChildrenWithoutResultPage = node.children
        ? Object.fromEntries(
            Object.entries(node.children).filter(
              ([pathSegment]) => pathSegment !== "/ergebnis",
            ),
          )
        : undefined;

      const subStates = nodeChildrenWithoutResultPage
        ? toStepStates(nodeChildrenWithoutResultPage, fullPath)
        : [];

      return {
        stepId: fullPath,
        isDone: node.isDone,
        isReachable: node.isReachable,
        url: `${flowId}${fullPath}`,
        subStates: subStates.length > 0 ? subStates : undefined,
      };
    });
  };

  return toStepStates(statusTree);
}
