import type { UserData } from "~/domains/userData";
import { arrayIsNonEmpty } from "~/util/array";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { addPageDataToUserData } from "../pageData";
import { buildFlowController } from "../server/buildFlowController";
import { insertIndexesIntoPath } from "../stepIdConverter";

export const flowDestination = (pathname: string, userData: UserData) => {
  const { arrayIndexes, stepId, currentFlow } =
    getPageAndFlowDataFromPathname(pathname);
  const flowController = buildFlowController({
    config: currentFlow.config,
    data: addPageDataToUserData(userData, { arrayIndexes }),
    guards: currentFlow.guards,
  });

  const destination =
    flowController.getNext(stepId) ?? flowController.getInitial();

  if (arrayIsNonEmpty(arrayIndexes)) {
    return insertIndexesIntoPath(pathname, destination, arrayIndexes);
  }

  return destination;
};
