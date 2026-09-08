import { type FlowSession } from "../newFlowEngine/createFlowSession";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { type PageConfigMap } from "../newFlowEngine/types";
import { arrayIsNonEmpty } from "~/util/array";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { arrayChar, EDIT_BUTTON_ID_PREFIX } from "~/services/array";

export const flowDestinationNewEngine = (
  pathname: string,
  flowSessionEngine: FlowSession<PageConfigMap>,
) => {
  const { flowId, arrayIndexes } = getPageAndFlowDataFromPathname(pathname);
  const nextStepId =
    flowSessionEngine.nextPath ?? flowSessionEngine.initialPath;
  const arrayInfoNextStepId = flowSessionEngine.getArrayInfoByPath(nextStepId);

  const destination = flowId + nextStepId;

  if (arrayIsNonEmpty(arrayIndexes) && nextStepId.includes(arrayChar)) {
    return flowId + resolveArrayCharacter(nextStepId, arrayIndexes, false);
  }

  // If the next step has an array and array info is available, we return the next step with the array edit anchor
  if (arrayIsNonEmpty(arrayIndexes) && arrayInfoNextStepId) {
    return `${destination}#${EDIT_BUTTON_ID_PREFIX}${arrayInfoNextStepId.name}-${arrayIndexes[0]}`;
  }

  return destination;
};
