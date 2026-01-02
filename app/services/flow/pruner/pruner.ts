import pick from "lodash/pick";
import { type ValidFlowPagesType } from "~/components/formFlowContext";
import type { FlowId } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import type { UserData } from "~/domains/userData";
import { buildFlowController } from "../server/buildFlowController";
import {
  type FormFieldsMap,
  getAllFieldsFromFlowId,
} from "~/domains/pageSchemas";
import { fieldIsArray } from "~/services/array";

export function pruneIrrelevantData(
  data: UserData,
  flowId: FlowId,
  path?: string,
) {
  const { guards, config } = flows[flowId];
  console.log(path);
  const flowController = buildFlowController({ guards, config, data });

  const formFields = getAllFieldsFromFlowId(flowId);

  const formPaths = flowController.getReachableSteps();
  const validFormFields = filterFormFields(formFields, formPaths);

  const validFlowPaths = getValidFlowPaths(formFields, formPaths);

  return { prunedData: pick(data, validFormFields), validFlowPaths };
}

export function filterFormFields(
  formFields: FormFieldsMap,
  validPaths: string[],
) {
  return validPaths.flatMap((stepId) => formFields[stepId] ?? []);
}

/* Return all the valid pages for current status of the flow and if the page is an array page. 
 Use `formFields` to filter only for pages with fields
*/
const getValidFlowPaths = (formFields: FormFieldsMap, validPaths: string[]) => {
  return validPaths
    .filter((stepId) => formFields[stepId])
    .map((stepId) => ({
      path: stepId,
      isArrayPage: fieldIsArray(stepId),
    }))
    .reduce((acc, { path, isArrayPage }) => {
      acc[path] = {
        isArrayPage,
      };
      return acc;
    }, {} as ValidFlowPagesType);
};
