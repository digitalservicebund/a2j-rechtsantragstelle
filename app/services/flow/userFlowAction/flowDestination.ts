import type { UserData } from "~/domains/userData";
import { arrayIsNonEmpty } from "~/util/array";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { addPageDataToUserData } from "../pageData";
import { buildFlowController } from "../server/buildFlowController";
import { insertIndexesIntoPath } from "../stepIdConverter";
import { pruneIrrelevantData } from "../pruner/pruner";

export const flowDestination = async (pathname: string, userData: UserData) => {
  const { arrayIndexes, stepId, currentFlow, flowId } =
    getPageAndFlowDataFromPathname(pathname);

  const { prunedData } = await pruneIrrelevantData(userData, flowId);

  const flowController = buildFlowController({
    config: currentFlow.config,
    data: addPageDataToUserData(prunedData, { arrayIndexes }),
    guards: currentFlow.guards,
  });

  const destination =
    flowController.getNext(stepId) ?? flowController.getInitial();

  if (arrayIsNonEmpty(arrayIndexes)) {
    return insertIndexesIntoPath(pathname, destination, arrayIndexes);
  }

  return destination;
};
