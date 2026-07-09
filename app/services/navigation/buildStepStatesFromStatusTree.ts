import { type FlowId } from "~/domains/flowIds";
import { type StepState } from "../flow/server/buildFlowController";
import { type StatusNode } from "../flow/newFlowEngine/statusTree";
import { flows } from "~/domains/flows.server";
import { getMetaConfigurationByStepId } from "../flow/getMetaConfigurationByStepId";

export function buildStepStatesFromStatusTree(
  statusTree: Record<string, StatusNode>,
  flowId: FlowId,
  validFlowPaths: string[],
): StepState[] {
  const currentFlow = flows[flowId];

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

      // Get the first valid path that starts with the fullPath
      const targetStepId =
        validFlowPaths.find((path) => path.startsWith(fullPath)) ?? fullPath;

      const excludedFromValidation = getMetaConfigurationByStepId(
        currentFlow,
        fullPath,
      )?.excludedFromValidation;

      return {
        stepId: fullPath,
        isDone: node.isDone,
        isReachable: node.isReachable,
        url: `${flowId}${targetStepId}`,
        subStates: subStates.length > 0 ? subStates : undefined,
        excludedFromValidation,
      };
    });
  };

  return toStepStates(statusTree);
}
