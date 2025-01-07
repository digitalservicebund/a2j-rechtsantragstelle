import { getContext } from "~/domains/contexts";
import { parsePathname } from "~/domains/flowIds";
import { buildStepValidator } from "./buildStepValidator";
import { getMultiFieldsByStepIdValidation } from "./getMultiFieldsByStepIdValidation";

export function validatorForFieldNames(fieldNames: string[], pathname: string) {
  const { flowId, stepId } = parsePathname(pathname);
  const context = getContext(flowId);
  const multiFieldsValidation = getMultiFieldsByStepIdValidation(
    flowId,
    stepId,
  );

  return buildStepValidator(context, fieldNames, multiFieldsValidation);
}
