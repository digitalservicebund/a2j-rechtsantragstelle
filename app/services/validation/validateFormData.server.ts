import { getContext } from "~/models/flows/contexts";
import type { FlowId } from "~/models/flows/flowIds";
import { buildStepValidator } from "./buildStepValidator";

export async function validateFormData(
  flowId: FlowId,
  formData: Record<string, FormDataEntryValue>,
) {
  const formDataKeys = Object.keys(formData);
  const validator = buildStepValidator(getContext(flowId), formDataKeys);
  return validator.validate(formData);
}
