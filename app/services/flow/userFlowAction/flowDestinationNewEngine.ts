import { type FlowSession } from "../newFlowEngine/createFlowSession";
import { insertIndexesIntoPath } from "../stepIdConverter";
import { arrayIsNonEmpty } from "~/util/array";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { type PageConfigMap } from "../newFlowEngine/types";

export const flowDestinationNewEngine = (
  pathname: string,
  flowSessionEngine: FlowSession<PageConfigMap>,
) => {
  const { flowId, arrayIndexes } = getPageAndFlowDataFromPathname(pathname);
  const nextStepId =
    flowSessionEngine.nextPath ?? flowSessionEngine.initialPath;

  const destination = flowId + nextStepId;

  if (arrayIsNonEmpty(arrayIndexes)) {
    return insertIndexesIntoPath(pathname, destination, arrayIndexes);
  }

  return destination;
};
