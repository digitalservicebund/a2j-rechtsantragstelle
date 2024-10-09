import _ from "lodash";
import type { Context } from "~/flows/contexts";
import type { FlowId } from "~/flows/flowIds";
import { flows } from "~/flows/flows.server";
import { buildFlowController } from "./server/buildFlowController";
import { validFormPaths, type Path } from "./validFormPaths";
import { resolveArrayCharacter } from "../array/resolveArrayCharacter";
import { type FormFieldsMap } from "../cms/fetchAllFormFields";

export function pruneIrrelevantData(
  data: Context,
  flowId: FlowId,
  formFields: FormFieldsMap,
) {
  const { guards, config } = flows[flowId];
  const flowController = buildFlowController({ guards, config, data });
  const formPaths = validFormPaths(flowController);
  const validFormFields = filterFormFields(formFields, formPaths);
  return _.pick(data, validFormFields);
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
