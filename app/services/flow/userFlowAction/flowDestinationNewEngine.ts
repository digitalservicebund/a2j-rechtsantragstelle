import { type createFlowSession } from "../newFlowEngine/createFlowSession";
import { insertIndexesIntoPath } from "../stepIdConverter";
import { arrayIsNonEmpty } from "~/util/array";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";

export const flowDestinationNewEngine = (
  pathname: string,
  flowSessionEngine: ReturnType<typeof createFlowSession>,
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
