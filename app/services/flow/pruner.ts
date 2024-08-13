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
import { fetchFlowPage } from "../cms/index.server";

type Step = string;
type FormField = string;
type StepPath = { steps: Step[]; arrayIndex?: number };

//const FormFields = { formField: string, arrayKey: string, arrayIndex: number}[]

type FormFieldPath = { formFields: FormField[]; arrayIndex?: number };
// export type Path = StepPath | FormFieldPath;

export async function prune(
  userData: Context,
  flowId: FlowId,
): Promise<Context> {
  console.time();
  const result = _.pick(
    userData,
    getPropsToKeep(await addFormFields(getPaths(userData, flowId), flowId)),
  );
  console.timeEnd();
  return result;
}

export function getPaths(userData: Context, flowId: FlowId): StepPath[] {
  const flowController = buildFlowController({
    ...flows[flowId],
    data: userData,
  });

  return [
    getMainFlowPath(flowController),
    ...getSubflowPaths(flowController, userData),
  ];
}

export async function addFormFields(
  paths: StepPath[],
  flowId: FlowId,
): Promise<FormFieldPath[]> {
  const steps = paths.map((path) => path.steps).flat();

  // to be replaced with new fetching
  const formFields = Object.fromEntries(
    await Promise.all(
      steps.map(async (step) => [
        step,
        (await fetchFlowPage("form-flow-pages", flowId, step)).form.flatMap(
          (formItem) => formItem.name,
        ),
      ]),
    ),
  );

  return paths.map(({ steps, ...array }) => ({
    formFields: steps.flatMap((step) => formFields[step]),
    ...array,
  }));
}

export function getPropsToKeep(paths: FormFieldPath[]): string[] {
  return paths.flatMap((path) => {
    if (path.arrayIndex === undefined) return path.formFields;

    return path.formFields.flatMap((formField) =>
      formField.replace("#", `[${path.arrayIndex}].`),
    );
  });
}

function getSteps(
  flowController: FlowController,
  subFlowsInitialStep?: string,
) {
  const stepIds: string[] = [];
  let stepId: string | undefined = parsePathname(
    subFlowsInitialStep || flowController.getInitial(),
  ).stepId;

  while (stepId) {
    stepIds.push(stepId);
    const nextPath = flowController.getNext(stepId);
    stepId = nextPath ? parsePathname(nextPath).stepId : undefined;
  }

  return stepIds;
}

function getMainFlowPath(flowController: FlowController): StepPath {
  return {
    steps: getSteps(flowController),
  };
}

function getSubflowPaths(
  flowController: FlowController,
  userData: Context,
): StepPath[] {
  return Object.entries(flowController.getRootMeta()?.arrays ?? {})
    .filter(([key]) => !_.isUndefined(userData[key]))
    .filter(([_key, config]) => userData[config.statementKey] === "yes")
    .map(([key, config]) => ({ key, config, data: userData[key] as ArrayData }))
    .map((array) =>
      array.data.map((_data, index) => ({
        steps: getSteps(
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
