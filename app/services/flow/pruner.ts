import pick from "lodash/pick";
import { ValidFlowPagesType } from "~/components/form/formFlowContext";
import type { Context } from "~/domains/contexts";
import type { FlowId } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { buildFlowController } from "./server/buildFlowController";
import { validFormPaths, type Path } from "./validFormPaths";
import { resolveArrayCharacter } from "../array/resolveArrayCharacter";
import {
  fetchAllFormFields,
  type FormFieldsMap,
} from "../cms/fetchAllFormFields";

export async function pruneIrrelevantData(data: Context, flowId: FlowId) {
  const formFields = await fetchAllFormFields(flowId);
  const { guards, config } = flows[flowId];
  const flowController = buildFlowController({ guards, config, data });
  const formPaths = validFormPaths(flowController);
  const validFormFields = filterFormFields(formFields, formPaths);

  const validFlowPaths = getValidFlowPaths(formFields, formPaths);

  return { prunedData: pick(data, validFormFields), validFlowPaths };
}

export function filterFormFields(
  formFields: FormFieldsMap,
  validPaths: Path[],
) {
  return validPaths.flatMap(({ stepIds, arrayIndex }) =>
    stepIds.flatMap((stepId) =>
      (formFields[stepId] ?? []).map((fieldname) =>
        resolveArrayCharacter(fieldname, arrayIndex ?? []),
      ),
    ),
  );
}

/* Return all the valid pages for current status of the flow and if the page is an array page. 
 Use `formFields` to filter only for pages with fields
*/
const getValidFlowPaths = (formFields: FormFieldsMap, validPaths: Path[]) => {
  return validPaths
    .flatMap(({ stepIds, arrayIndex }) =>
      stepIds
        .filter((stepId) => formFields[stepId])
        .map((stepId) => ({
          path: stepId,
          isArrayPage: typeof arrayIndex !== "undefined",
        })),
    )
    .reduce((acc, { path, isArrayPage }) => {
      acc[path] = {
        isArrayPage,
      };
      return acc;
    }, {} as ValidFlowPagesType);
};
