import { type createFlowSession } from "../newFlowEngine/createFlowSession";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { insertIndexesIntoPath } from "../stepIdConverter";
import { arrayIsNonEmpty } from "~/util/array";

export const flowDestinationNewEngine = (
  flowSessionEngine: ReturnType<typeof createFlowSession>,
) => {
  const nextStepId =
    flowSessionEngine.nextPath ?? flowSessionEngine.initialPath;

  const { arrayIndexes, flowId } = getPageAndFlowDataFromPathname(
    flowSessionEngine.currentPath,
  );

  const destination = flowId + nextStepId;

  if (arrayIsNonEmpty(arrayIndexes)) {
    return insertIndexesIntoPath(
      flowSessionEngine.currentPath,
      destination,
      arrayIndexes,
    );
  }

  return destination;
};
