import _ from "lodash";
import { flows } from "~/flows/flows.server";
import { ArrayConfig } from "~/services/array";
import { fetchFlowPage } from "~/services/cms/index.server";
import {
  StrapiArraySummaryComponentSchema,
  isStrapiArraySummary,
} from "~/services/cms/models/StrapiArraySummary";
import { StrapiFormComponent } from "~/services/cms/models/StrapiFormComponent";
import { StrapiFormFlowPageSchema } from "~/services/cms/models/StrapiFormFlowPage";
import { addPageDataToUserData } from "~/services/flow/pageData";
import {
  FlowController,
  buildFlowController,
} from "~/services/flow/server/buildFlowController";
import { ArrayData, BasicTypes, Context, ObjectType } from "./contexts";
import { FlowId } from "./flowIds";

export async function getPrunedUserData(userData: Context, flowId: FlowId) {
  const flowController = buildFlowController({
    config: flows[flowId].config,
    data: userData,
    guards: flows[flowId].guards,
  });

  const strapiComponents = (
    await Promise.all(
      getSteps(flowController).flatMap(
        async (step) => await getComponents(step),
      ),
    )
  )
    .filter((step) => step.length > 0)
    .flat();

  const formComponents = strapiComponents.filter(isFormComponent);
  const arrayComponents = strapiComponents.filter(isArrayComponent);

  const baseData = formComponents.reduce(
    (acc, component) => _.merge(acc, extractPrunedData(component, userData)),
    {} as Context,
  );

  // arrays
  const arrayData = await arrayComponents.reduce(async (accPromise, array) => {
    const acc = await accPromise;
    const arrayConfiguration =
      flowController.getRootMeta()?.arrays?.[array.category];

    if (
      !arrayConfiguration ||
      userData[arrayConfiguration?.statementKey] !== "yes" ||
      !userData[array.category]
    )
      return acc;

    await Promise.all(
      (userData[array.category] as ArrayData).map(async (_arrayData, index) => {
        const subFlowController = buildFlowController({
          config: flows[flowId].config,
          data: addPageDataToUserData(userData, {
            arrayIndexes: [index],
          }),
          guards: flows[flowId].guards,
        });

        const subflowComponents = (
          await Promise.all(
            getSteps(
              subFlowController,
              getSubFlowInitialStep(arrayConfiguration),
            )
              .filter((step) => step.startsWith(arrayConfiguration.url))
              .flatMap(async (step) => await getComponents(step)),
          )
        )
          .flat()
          .filter(isFormComponent);

        const subFlowData = subflowComponents.reduce(
          (acc, subFlowComponent) => {
            _.merge(acc, extractPrunedData(subFlowComponent, userData, index));
            return acc;
          },
          {} as Context,
        );

        acc[array.category] = acc[array.category] || [];
        (acc[array.category] as ArrayData)[index] = subFlowData[
          array.category
        ] as {
          [key: string]: BasicTypes;
        };
      }),
    );

    return acc;
  }, {} as Promise<Context>);

  return _.merge(baseData, arrayData);
}

// use lodash
function extractPrunedData(
  strapiFormComponent: StrapiFormComponent,
  userData: Context,
  index?: number,
): Context {
  const prunedContext = {} as Context;

  // arrayData
  if (
    index !== undefined &&
    index >= 0 &&
    strapiFormComponent.name.includes("#")
  ) {
    const nameParts = strapiFormComponent.name.split("#");
    if (nameParts.length !== 2) return {}; //throw error?
    const [category, key] = nameParts;
    const value = (userData[category] as ArrayData)?.[index][key];

    if (value === undefined) return {};
    prunedContext[category] = {};
    (prunedContext[category] as ObjectType)[key] = value;

    return prunedContext;
  }

  // nestedData
  const nameParts = strapiFormComponent.name.split(".");
  if (nameParts.length === 2) {
    const [category, key] = nameParts;
    const value = (userData[category] as ObjectType)?.[key];

    if (value === undefined) return {};
    prunedContext[category] = {};
    (prunedContext[category] as ObjectType)[key] = value;

    // basic data
  } else {
    const key = strapiFormComponent.name as keyof Context;
    const value = _.get(userData, key);
    // const value = userData[key];

    if (value === undefined) return {};
    prunedContext[key] = value;
  }

  return prunedContext;
}

// to do gibts schon
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

async function getComponents(
  step: string,
): Promise<
  (StrapiFormComponent | Zod.infer<typeof StrapiArraySummaryComponentSchema>)[]
> {
  const flowPage: Zod.infer<typeof StrapiFormFlowPageSchema> =
    await fetchFlowPage("form-flow-pages", step);

  return [
    ...flowPage.pre_form.filter(isStrapiArraySummary),
    ...flowPage.post_form.filter(isStrapiArraySummary),
    ...flowPage.form,
  ];
}

// do we even need this separation?
function splitStepId(path: string): { stepId: string; flowId?: string } {
  const flowId = "/beratungshilfe/antrag/";
  return path.startsWith(flowId)
    ? { stepId: path.slice(flowId.length), flowId }
    : { stepId: path };
}

function isFormComponent(
  component:
    | StrapiFormComponent
    | Zod.infer<typeof StrapiArraySummaryComponentSchema>,
): component is StrapiFormComponent {
  return component.__component !== "page.array-summary";
}

function isArrayComponent(
  component:
    | StrapiFormComponent
    | Zod.infer<typeof StrapiArraySummaryComponentSchema>,
): component is Zod.infer<typeof StrapiArraySummaryComponentSchema> {
  return !isFormComponent(component);
}

function getSubFlowInitialStep(arrayConfig: ArrayConfig): string {
  return arrayConfig.url + "/" + arrayConfig.initialInputUrl;
}
