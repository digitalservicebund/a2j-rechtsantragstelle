import _ from "lodash";
import { flows } from "~/flows/flows.server";
import { ArrayConfig } from "~/services/array";
import { fetchFlowPage } from "~/services/cms/index.server";
import { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { StrapiFormFlowPageSchema } from "~/services/cms/models/StrapiFormFlowPage";
import { addPageDataToUserData } from "~/services/flow/pageData";
import {
  FlowController,
  buildFlowController,
} from "~/services/flow/server/buildFlowController";
import { ArrayData, Context } from "./contexts";
import { FlowId } from "./flowIds";

export async function getPrunedUserData(userData: Context, flowId: FlowId) {
  const flowController = buildFlowController({
    config: flows[flowId].config,
    data: userData,
    guards: flows[flowId].guards,
  });

  const baseFlowComponents = (
    await Promise.all(
      getSteps(flowController).flatMap(
        async (step) => await getComponents(step),
      ),
    )
  )
    .filter((step) => step.length > 0)
    .flat();

  const baseData = baseFlowComponents.reduce(
    (acc, component) => _.merge(acc, copyFromUserData(component, userData)),
    {} as Context,
  );

  const subFlowComponents = await Promise.all(
    getSubflowSteps(flowId, flowController, userData).map(
      async ({ steps, index }) => ({
        index,
        components: (
          await Promise.all(steps.map((step) => getComponents(step)))
        ).flat(),
      }),
    ),
  );

  const subFlowData = subFlowComponents.reduce(
    (acc, { components, index }) =>
      _.merge(
        acc,
        components.reduce(
          (acc, component) =>
            _.merge(acc, copyFromUserData(component, userData, index)),
          {} as Context,
        ),
      ),
    {} as Context,
  );

  return _.merge(baseData, subFlowData);
}

function copyFromUserData(
  strapiFormComponent: StrapiFormComponent,
  userData: Context,
  index?: number,
): Context {
  const path = strapiFormComponent.name.replace(
    "#",
    index !== undefined ? `[${index}].` : ".", // handle deep nesting?
  );
  const value = _.get(userData, path);
  return _.isUndefined(value) ? {} : _.set({}, path, value);
}

function getSteps(
  flowController: FlowController,
  subFlowsInitialStep?: string,
) {
  const paths: string[] = [];
  let path: string | undefined =
    subFlowsInitialStep || flowController.getInitial();

  while (path) {
    paths.push(path);
    path = flowController.getNext(splitStepId(path).stepId);
  }

  return paths;
}

function getSubflowSteps(
  flowId: string,
  flowController: FlowController,
  userData: Context,
): { index: number; steps: string[] }[] {
  return Object.entries(flowController.getRootMeta()?.arrays ?? {})
    .filter(([key]) => !_.isUndefined(userData[key]))
    .filter(([_key, config]) => userData[config.statementKey] === "yes")
    .map(([key, config]) => ({ key, config, data: userData[key] as ArrayData }))
    .map((array) =>
      array.data.map((_data, index) => ({
        index,
        steps: getSteps(
          buildFlowController({
            config: flowController.getConfig(),
            data: addPageDataToUserData(userData, {
              arrayIndexes: [index],
            }),
            guards: flowController.getGuards(),
          }),
          getSubFlowInitialStep(array.config),
        ).filter((step) => step.startsWith(array.config.url)),
      })),
    )
    .flat();
}

async function getComponents(step: string): Promise<StrapiFormComponent[]> {
  const flowPage: Zod.infer<typeof StrapiFormFlowPageSchema> =
    await fetchFlowPage("form-flow-pages", step);

  return flowPage.form;
}

function splitStepId(path: string): { stepId: string; flowId?: string } {
  const flowId = "/beratungshilfe/antrag/";
  return path.startsWith(flowId)
    ? { stepId: path.slice(flowId.length), flowId }
    : { stepId: path };
}

function getSubFlowInitialStep(arrayConfig: ArrayConfig): string {
  return arrayConfig.url + "/" + arrayConfig.initialInputUrl;
}
