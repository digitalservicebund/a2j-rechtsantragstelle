import type { FlowId } from "~/domains/flowIds";
import { getMultiFieldsValidation } from "~/domains/multiFieldsFlowValidation";

export const getMultiFieldsByStepIdValidation = (
  flowId: FlowId,
  stepId: string,
) => {
  const multiFieldsValidation = getMultiFieldsValidation(flowId);

  return multiFieldsValidation ? multiFieldsValidation[stepId] : undefined;
};
