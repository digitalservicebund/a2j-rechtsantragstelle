import { createFlowSession} from "../newFlowEngine/createFlowSession";
import { insertIndexesIntoPath } from "../stepIdConverter";
import { arrayIsNonEmpty } from "~/util/array";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { type PageConfigMap } from "../newFlowEngine/types";
import { type CompiledFlow } from "../newFlowEngine/compileFlow";

export const flowDestinationNewEngine = <C extends PageConfigMap>(
  pathname: string,
  compiledStaticFlow: CompiledFlow<C>,
  userDataPruned: Parameters<typeof createFlowSession>[1],
) => {
  const { flowId, arrayIndexes, stepId } = getPageAndFlowDataFromPathname(pathname);

  // We need to create a new flow session with the pruned user data to get the next step id, because the next step id is determined by the flow engine based on the current state of the user data.
  const flowSessionEngineDestination = createFlowSession(
    compiledStaticFlow,
    userDataPruned,
    stepId,
  );

  const nextStepId =
    flowSessionEngineDestination.nextPath ?? flowSessionEngineDestination.initialPath;

  const destination = flowId + nextStepId;

  if (arrayIsNonEmpty(arrayIndexes)) {
    return insertIndexesIntoPath(pathname, destination, arrayIndexes);
  }

  return destination;
};
