import _ from "lodash";
import type { ArrayData, Context } from "~/flows/contexts";
import { type FlowId, parsePathname } from "~/flows/flowIds";
import { flows } from "~/flows/flows.server";
import type { ArrayConfig } from "~/services/array";
import {
  type FlowController,
  buildFlowController,
} from "./server/buildFlowController";

export type Path = { stepIds: string[]; arrayIndex?: number };

export function getPaths(userData: Context, flowId: FlowId): Path[] {
  const flowController = buildFlowController({
    ...flows[flowId],
    data: userData,
  });

  return [
    getMainFlowPath(flowController),
    ...getSubflowPaths(flowController, userData),
  ];
}

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

function getMainFlowPath(flowController: FlowController): Path {
  return { stepIds: getSteps(flowController) };
}

function getSubflowPaths(
  flowController: FlowController,
  userData: Context,
): Path[] {
  return Object.entries(flowController.getRootMeta()?.arrays ?? {})
    .filter(([key]) => !_.isUndefined(userData[key]))
    .filter(([_key, config]) => userData[config.statementKey] === "yes")
    .map(([key, arrayConfig]) =>
      (userData[key] as ArrayData).map((_data, index) => ({
        stepIds: getSteps(
          buildFlowController({
            config: flowController.getConfig(),
            guards: flowController.getGuards(),
            data: _.merge(userData, {
              pageData: { arrayIndexes: [index] },
            }),
          }),
          getSubFlowInitialStep(arrayConfig),
        ).filter(stepBelongsToArray(arrayConfig)),
        arrayIndex: index,
      })),
    )
    .flat();
}

function getSubFlowInitialStep(arrayConfig: ArrayConfig): string {
  return arrayConfig.url + "/" + arrayConfig.initialInputUrl;
}

function stepBelongsToArray(arrayConfig: ArrayConfig) {
  return (stepId: string) =>
    stepId.startsWith(parsePathname(arrayConfig.url).stepId);
}
