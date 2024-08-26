import _ from "lodash";
import type { Context } from "~/flows/contexts";
import type { FlowId } from "~/flows/flowIds";
import { validFormPaths, type Path } from "./validFormPaths";
import { resolveArrayCharacter } from "../array/resolveArrayCharacter";
import {
  fetchAllFormFields,
  type FormFieldsMap,
} from "../cms/fetchAllFormFields";

export async function pruneIrrelevantData(
  userData: Context,
  flowId: FlowId,
): Promise<Context> {
  const formFields = await fetchAllFormFields(flowId);
  const formPaths = validFormPaths(userData, flowId);
  const validFormFields = filterFormFields(formFields, formPaths);
  return _.pick(userData, validFormFields);
}

export function filterFormFields(
  formFields: FormFieldsMap,
  validPaths: Path[],
) {
  return validPaths.flatMap(({ stepIds, arrayIndex }) =>
    stepIds.flatMap((stepId) =>
      (formFields[`/${stepId}`] ?? []).map((fieldname) =>
        resolveArrayCharacter(fieldname, arrayIndex ?? []),
      ),
    ),
  );
}
