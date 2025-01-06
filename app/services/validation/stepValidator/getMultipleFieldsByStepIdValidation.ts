import type { FlowId } from "~/domains/flowIds";
import { getMultipleFieldsValidation } from "~/domains/multipleFieldsFlowValidation";

export const getMultipleFieldsByStepIdValidation = (
  flowId: FlowId,
  stepId: string,
) => {
  const multipleFieldsValidation = getMultipleFieldsValidation(flowId);

  return multipleFieldsValidation
    ? multipleFieldsValidation[stepId]
    : undefined;
};
