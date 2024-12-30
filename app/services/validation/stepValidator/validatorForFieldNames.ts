import { getContext } from "~/domains/contexts";
import { parsePathname } from "~/domains/flowIds";
import { buildStepValidator } from "./buildStepValidator";
import { getMultipleFieldsByStepIdValidation } from "./getMultipleFieldsByStepIdValidation";

export function validatorForFieldNames(fieldNames: string[], pathname: string) {
  const flowId = parsePathname(pathname).flowId;
  const context = getContext(flowId);
  const multipleFieldsValidation =
    getMultipleFieldsByStepIdValidation(pathname);

  return buildStepValidator(context, fieldNames, multipleFieldsValidation);
}
