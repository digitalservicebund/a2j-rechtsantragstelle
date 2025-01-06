import { parsePathname } from "~/domains/flowIds";
import { getMultipleFieldsValidation } from "~/domains/multipleFieldsFlowValidation";

export const getMultipleFieldsByStepIdValidation = (
  stepIdParameter: string,
) => {
  const { flowId, stepId } = parsePathname(stepIdParameter);
  const multipleFieldsValidation = getMultipleFieldsValidation(flowId);

  return multipleFieldsValidation
    ? multipleFieldsValidation[stepId]
    : undefined;
};
