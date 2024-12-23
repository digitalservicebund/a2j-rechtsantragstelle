import { parsePathname } from "~/domains/flowIds";
import { getValidationMultipleFields } from "~/domains/validationsMultipleFields";

export const getValidationMultipleFieldsByPathname = (pathname: string) => {
  const { flowId, stepId } = parsePathname(pathname);
  const validationMultipleFields = getValidationMultipleFields(flowId);

  if (!validationMultipleFields) {
    return undefined;
  }

  return validationMultipleFields[stepId];
};
