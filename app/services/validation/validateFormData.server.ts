import { getContext } from "~/domains/contexts";
import type { FlowId } from "~/domains/flowIds";
import { buildStepValidator } from "./buildStepValidator";

export async function validateFormData(
  flowId: FlowId,
  formData: Record<string, FormDataEntryValue>,
) {
  const formDataKeys = Object.keys(formData);
  const validator = buildStepValidator(getContext(flowId), formDataKeys);
  return validator.validate(formData);
}
