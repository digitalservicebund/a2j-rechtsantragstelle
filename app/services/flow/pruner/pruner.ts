import pick from "lodash/pick";
import { type ValidFlowPagesType } from "~/components/formFlowContext";
import type { FlowId } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import type { UserData } from "~/domains/userData";
import { buildFlowController } from "../server/buildFlowController";
import { resolveArrayCharacter } from "../../array/resolveArrayCharacter";
import { type FormFieldsMap } from "../../cms/fetchAllFormFields";
import { validFormPaths, type Path } from "./validFormPaths";
import { getAllFieldsFromFlowId } from "~/domains/pageSchemas";

export function pruneIrrelevantData(data: UserData, flowId: FlowId) {
  const { guards, config } = flows[flowId];
  const flowController = buildFlowController({ guards, config, data });

  const formFields = getAllFieldsFromFlowId(flowId);

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
          isArrayPage: arrayIndex !== undefined,
        })),
    )
    .reduce((acc, { path, isArrayPage }) => {
      acc[path] = {
        isArrayPage,
      };
      return acc;
    }, {} as ValidFlowPagesType);
};
