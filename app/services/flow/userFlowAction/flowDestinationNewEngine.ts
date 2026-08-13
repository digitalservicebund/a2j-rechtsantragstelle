import { type FlowSession } from "../newFlowEngine/createFlowSession";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { type PageConfigMap } from "../newFlowEngine/types";
import { arrayIsNonEmpty } from "~/util/array";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";

export const flowDestinationNewEngine = (
  pathname: string,
  flowSessionEngine: FlowSession<PageConfigMap>,
) => {
  const { flowId, arrayIndexes } = getPageAndFlowDataFromPathname(pathname);
  const nextStepId =
    flowSessionEngine.nextPath ?? flowSessionEngine.initialPath;

  const destination = flowId + nextStepId;

  if (arrayIsNonEmpty(arrayIndexes)) {
    return flowId + resolveArrayCharacter(nextStepId, arrayIndexes, false);
  }

  return destination;
};
