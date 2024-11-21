import _ from "lodash";
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
  return _.pick(data, validFormFields);
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
