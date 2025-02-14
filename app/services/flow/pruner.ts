import pick from "lodash/pick";
import { ValidFlowPagesType } from "~/components/form/flowFormularContext";
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

  const validPathsAndFieldsFlow = getValidPathsAndFieldsFlow(
    formFields,
    formPaths,
  );

  return { pruneData: pick(data, validFormFields), validPathsAndFieldsFlow };
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

const getValidPathsAndFieldsFlow = (
  formFields: FormFieldsMap,
  validPaths: Path[],
) => {
  return validPaths
    .flatMap(({ stepIds, arrayIndex }) =>
      stepIds
        .filter((stepId) => formFields[stepId])
        .map((stepId) => ({
          path: stepId,
          fields: formFields[stepId],
          isArrayPage: typeof arrayIndex !== "undefined",
        })),
    )
    .reduce((acc, { path, fields, isArrayPage }) => {
      acc[path] = {
        fields,
        isArrayPage,
      };
      return acc;
    }, {} as ValidFlowPagesType);
};
