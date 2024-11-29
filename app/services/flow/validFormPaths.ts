import type { ArrayData } from "~/domains/contexts";
import { parsePathname } from "~/domains/flowIds";
import type { ArrayConfigFlow } from "~/services/array";
import { addPageDataToUserData } from "./pageData";
import {
  type FlowController,
  buildFlowController,
} from "./server/buildFlowController";

export type Path = { stepIds: string[]; arrayIndex?: number };

export const validFormPaths = (flowController: FlowController) => [
  { stepIds: getSteps(flowController) },
  ...getSubflowPaths(flowController),
];

function getSteps(
  flowController: FlowController,
  subFlowsInitialStep?: string,
) {
  const stepIds: string[] = [];
  let stepId: string | undefined = parsePathname(
    subFlowsInitialStep ?? flowController.getInitial(),
  ).stepId;

  while (stepId) {
    stepIds.push(stepId);
    const nextPath = flowController.getNext(stepId);
    stepId = nextPath ? parsePathname(nextPath).stepId : undefined;
  }

  return stepIds;
}

function getSubflowPaths(flowController: FlowController): Path[] {
  const userData = flowController.getUserdata();

  return Object.entries(flowController.getRootMeta()?.arrays ?? {})
    .filter(
      ([key, arrayConfig]) =>
        userData[key] && userData[arrayConfig.statementKey] === "yes",
    )
    .filter(([_key, arrayConfig]) => {
      // Filter arrays who's first step is not reachable from the main flow
      const previousStepId = stepIdBeforeArray(flowController, arrayConfig);
      return flowController.getReachableSteps().includes(previousStepId);
    })
    .map(([key, arrayConfig]) =>
      // For each entry in an array, build a flow controller starting at the initial step of the array
      (userData[key] as ArrayData).map((_data, index) => ({
        arrayIndex: index,
        stepIds: getSteps(
          buildFlowController({
            config: flowController.getConfig(),
            guards: flowController.getGuards(),
            data: addPageDataToUserData(userData, { arrayIndexes: [index] }),
          }),
          getSubFlowInitialStep(arrayConfig),
        ).filter(stepBelongsToArray(arrayConfig)),
      })),
    )
    .flat();
}

function getSubFlowInitialStep(arrayConfig: ArrayConfigFlow): string {
  return arrayConfig.url + "/" + arrayConfig.initialInputUrl;
}

function stepBelongsToArray(arrayConfig: ArrayConfigFlow) {
  return (stepId: string) =>
    stepId.startsWith(parsePathname(arrayConfig.url).stepId);
}

function stepIdBeforeArray(
  flowController: FlowController,
  arrayConfig: ArrayConfigFlow,
) {
  const arrayFlowController = buildFlowController({
    config: flowController.getConfig(),
    guards: flowController.getGuards(),
    data: addPageDataToUserData(flowController.getUserdata(), {
      arrayIndexes: [0], // guards expect an array index to be available in order to reach the initial array step
    }),
  });
  const initialStep = getSubFlowInitialStep(arrayConfig);
  const initialStepId = parsePathname(initialStep).stepId;
  const previousUrl = arrayFlowController.getPrevious(initialStepId) ?? "";
  return parsePathname(previousUrl).stepId;
}
