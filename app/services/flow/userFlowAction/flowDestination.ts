import type { UserData } from "~/domains/userData";
import { arrayIsNonEmpty } from "~/util/array";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { addPageDataToUserData } from "../pageData";
import { buildFlowController } from "../server/buildFlowController";
import { insertIndexesIntoPath } from "../stepIdConverter";
import { beratungshilfeManager } from "~/domains/beratungshilfe/vorabcheck/new/flowConfig";
import { createFlowSession } from "../server/new/sessionInterpreter";

export const flowDestination = (pathname: string, userData: UserData) => {
  const { arrayIndexes, stepId, currentFlow } =
    getPageAndFlowDataFromPathname(pathname);

  const flowController = buildFlowController({
    config: currentFlow.config,
    data: addPageDataToUserData(userData, { arrayIndexes }),
    guards: "guards" in currentFlow ? currentFlow.guards : {},
  });

  let destination =
    flowController.getNext(stepId) ?? flowController.getInitial();

  const flowId = currentFlow.config.id;

  if (flowId === "/beratungshilfe/vorabcheck") {
    const sessionManager = createFlowSession(
      beratungshilfeManager,
      addPageDataToUserData(userData, { arrayIndexes }) as any,
      stepId,
    );
    const nextStep = sessionManager.getNextStep();
    destination = flowId + "/" + nextStep?.stepId;
  }

  if (arrayIsNonEmpty(arrayIndexes)) {
    return insertIndexesIntoPath(pathname, destination, arrayIndexes);
  }

  return destination;
};
