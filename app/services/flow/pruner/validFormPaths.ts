import { parsePathname } from "~/domains/flowIds";
import type { ArrayData, UserData } from "~/domains/userData";
import type { ArrayConfigServer } from "~/services/array";
import { addPageDataToUserData } from "../pageData";
import {
  type FlowController,
  buildFlowController,
} from "../server/buildFlowController";

export type Path = { stepIds: string[]; arrayIndex?: number[] };

export const validFormPaths = (flowController: FlowController): Path[] => {
  const arrays = flowController.getRootMeta()?.arrays ?? {};
  const userData = flowController.getUserdata();
  const subFlowsPaths = getSubflowPaths(flowController, arrays, userData, []);
  const stepsIds = [{ stepIds: getSteps(flowController) }, ...subFlowsPaths];

  return stepsIds;
};

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

function getSubflowPaths(
  flowController: FlowController,
  arrays: Record<string, ArrayConfigServer> | undefined,
  userData: UserData,
  arrayIndex: number[],
): Path[] {
  if (!arrays) return [];

  return Object.entries(arrays)
    .filter(([key, _arrayConfig]) => userData[key])
    .filter(([_key, arrayConfig]) => {
      // Filter arrays who's first step is not reachable from the main flow
      const previousStepId = stepIdBeforeArray(flowController, arrayConfig);
      return flowController.getReachableSteps().includes(previousStepId);
    })
    .flatMap(
      ([key, arrayConfig]) => {
        return (userData[key] as ArrayData).flatMap((data, index) => {
          const nestedPaths = getSubflowPaths(
            flowController,
            arrayConfig.nestedArrays,
            data as UserData,
            [index],
          );

          return [
            {
              arrayIndex:
                arrayIndex.length === 0 ? [index] : [...arrayIndex, index],
              stepIds: getSteps(
                buildFlowController({
                  config: flowController.getConfig(),
                  guards: flowController.getGuards(),
                  data: addPageDataToUserData(userData, {
                    arrayIndexes: [index],
                  }),
                }),
                getSubFlowInitialStep(arrayConfig),
              ).filter(stepBelongsToArray(arrayConfig)),
            },
            ...nestedPaths,
          ];
        });
      },
      // For each entry in an array, build a flow controller starting at the initial step of the array
    );
}

function getSubFlowInitialStep(arrayConfig: ArrayConfigServer): string {
  return arrayConfig.url + "/" + arrayConfig.initialInputUrl;
}

function stepBelongsToArray(arrayConfig: ArrayConfigServer) {
  return (stepId: string) =>
    stepId.startsWith(parsePathname(arrayConfig.url).stepId);
}

function stepIdBeforeArray(
  flowController: FlowController,
  arrayConfig: ArrayConfigServer,
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
