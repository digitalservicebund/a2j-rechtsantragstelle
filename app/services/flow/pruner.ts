import _ from "lodash";
import { ArrayData, Context } from "~/flows/contexts";
import { FlowId, parsePathname } from "~/flows/flowIds";
import { flows } from "~/flows/flows.server";
import { addPageDataToUserData } from "./pageData";
import {
  FlowController,
  buildFlowController,
} from "./server/buildFlowController";
import { ArrayConfig } from "../array";
import { fetchAllFormFields } from "../cms/index.server";

type Path = { stepIds: string[]; arrayIndex?: number };
type FormField = { name: string; arrayIndex?: number };

export async function pruneIrrelevantData(
  userData: Context,
  flowId: FlowId,
): Promise<Context> {
  return _.pick(
    userData,
    getPropsToKeep(await getFormFields(getPaths(userData, flowId), flowId)),
  );
}

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

export async function getFormFields(
  paths: Path[],
  flowId: FlowId,
): Promise<FormField[]> {
  const formFieldsMap = (await fetchAllFormFields(flowId)).reduce(
    (acc, { stepId, formFields }) => {
      acc[stepId] = formFields;
      return acc;
    },
    {} as { [stepId: string]: string[] },
  );

  return paths.flatMap(({ stepIds: stepIds, arrayIndex }) =>
    stepIds.flatMap((stepId) =>
      (formFieldsMap[`/${stepId}`] ?? []).map((name) => ({ name, arrayIndex })),
    ),
  );
}

export function getPropsToKeep(formFields: FormField[]): string[] {
  return formFields.map((formField) =>
    formField.name.replace("#", `[${formField.arrayIndex}].`),
  );
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
  return {
    stepIds: getSteps(flowController),
  };
}

function getSubflowPaths(
  flowController: FlowController,
  userData: Context,
): Path[] {
  return Object.entries(flowController.getRootMeta()?.arrays ?? {})
    .filter(([key]) => !_.isUndefined(userData[key]))
    .filter(([_key, config]) => userData[config.statementKey] === "yes")
    .map(([key, config]) => ({ key, config, data: userData[key] as ArrayData }))
    .map((array) =>
      array.data.map((_data, index) => ({
        stepIds: getSteps(
          buildFlowController({
            config: flowController.getConfig(),
            data: addPageDataToUserData(userData, {
              arrayIndexes: [index],
            }),
            guards: flowController.getGuards(),
          }),
          getSubFlowInitialStep(array.config),
        ).filter(stepBelongsToArray(array.config)),
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
