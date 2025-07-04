import { arrayIsNonEmpty } from "~/util/array";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { type buildFlowController } from "../server/buildFlowController";
import { insertIndexesIntoPath } from "../stepIdConverter";

export const getDestinationFlowAction = (
  flowController: ReturnType<typeof buildFlowController>,
  pathname: string,
) => {
  const { arrayIndexes, stepId } = getPageAndFlowDataFromPathname(pathname);

  const destination =
    flowController.getNext(stepId) ?? flowController.getInitial();

  if (arrayIsNonEmpty(arrayIndexes)) {
    return insertIndexesIntoPath(pathname, destination, arrayIndexes);
  }

  return destination;
};
