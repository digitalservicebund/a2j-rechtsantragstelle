import { getContext } from "~/domains/userData";
import { parsePathname } from "~/domains/flowIds";
import { buildStepSchema } from "./buildStepSchema";
import { getMultiFieldsByStepIdValidation } from "./getMultiFieldsByStepIdValidation";

export function schemaForFieldNames(fieldNames: string[], pathname: string) {
  const { flowId, stepId } = parsePathname(pathname);
  const context = getContext(flowId);
  const multiFieldsValidation = getMultiFieldsByStepIdValidation(
    flowId,
    stepId,
  );

  return buildStepSchema(context, fieldNames, multiFieldsValidation);
}
