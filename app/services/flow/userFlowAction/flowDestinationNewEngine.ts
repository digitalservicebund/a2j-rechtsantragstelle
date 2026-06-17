import { type createFlowSession } from "../newFlowEngine/createFlowSession";
import { insertIndexesIntoPath } from "../stepIdConverter";
import { arrayIsNonEmpty } from "~/util/array";
import { type FlowId } from "~/domains/flowIds";

export const flowDestinationNewEngine = (
  flowId: FlowId,
  arrayIndexes: number[],
  pathname: string,
  flowSessionEngine: ReturnType<typeof createFlowSession>,
) => {
  const nextStepId =
    flowSessionEngine.nextPath ?? flowSessionEngine.initialPath;

  const destination = flowId + nextStepId;

  if (arrayIsNonEmpty(arrayIndexes)) {
    return insertIndexesIntoPath(pathname, destination, arrayIndexes);
  }

  return destination;
};
