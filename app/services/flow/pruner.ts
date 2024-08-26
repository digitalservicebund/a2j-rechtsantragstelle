import _ from "lodash";
import type { Context } from "~/flows/contexts";
import type { FlowId } from "~/flows/flowIds";
import { getPaths, type Path } from "./getPaths";
import { resolveArrayCharacter } from "../array/resolveArrayCharacter";
import {
  fetchAllFormFields,
  type FormFieldsMap,
} from "../cms/fetchAllFormFields";

type FormField = { name: string; arrayIndex?: number };

export async function pruneIrrelevantData(
  userData: Context,
  flowId: FlowId,
): Promise<Context> {
  const allFormFields = await fetchAllFormFields(flowId);
  const paths = getPaths(userData, flowId);
  const formFields = await getFormFields(paths, allFormFields);
  const propsToKeep = formFields.map(({ name, arrayIndex }) =>
    resolveArrayCharacter(name, arrayIndex !== undefined ? [arrayIndex] : []),
  );
  return _.pick(userData, propsToKeep);
}

export async function getFormFields(
  paths: Path[],
  formFieldsMap: FormFieldsMap,
): Promise<FormField[]> {
  return paths.flatMap(({ stepIds, arrayIndex }) =>
    stepIds.flatMap((stepId) =>
      (formFieldsMap[`/${stepId}`] ?? []).map((name) => ({ name, arrayIndex })),
    ),
  );
}
