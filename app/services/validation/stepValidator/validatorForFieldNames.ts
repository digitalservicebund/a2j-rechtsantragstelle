import { getContext } from "~/domains/contexts";
import { parsePathname } from "~/domains/flowIds";
import { buildStepValidator } from "./buildStepValidator";
import { getValidationMultipleFieldsByPathname } from "./getValidationMultipleFieldsByPathName";

export function validatorForFieldNames(fieldNames: string[], pathname: string) {
  const flowId = parsePathname(pathname).flowId;
  const context = getContext(flowId);
  const validationMultipleFields =
    getValidationMultipleFieldsByPathname(pathname);

  return buildStepValidator(context, fieldNames, validationMultipleFields);
}
