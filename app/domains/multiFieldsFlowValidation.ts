import { isKeyOfObject } from "~/util/objects";
import type { FlowId } from "./flowIds";
import { fluggastrechtMultiFieldsValidation } from "./fluggastrechte/formular/multiFieldsValidation";
import { fluggastrechtVorabcheckMultiFieldsValidation } from "./fluggastrechte/vorabcheck/multiFieldsValidation";
import { type MultiFieldsStepIdValidation } from "./types";
import { geldEinklagenMultiFieldsValidation } from "./geldEinklagen/formular/multiFieldsValidation";

const multiFieldsFlowValidation = {
  "/fluggastrechte/vorabcheck":
    fluggastrechtVorabcheckMultiFieldsValidation as MultiFieldsStepIdValidation,
  "/fluggastrechte/formular":
    fluggastrechtMultiFieldsValidation as MultiFieldsStepIdValidation,
  "/geld-einklagen/formular":
    geldEinklagenMultiFieldsValidation as MultiFieldsStepIdValidation,
} as const satisfies Partial<Record<FlowId, MultiFieldsStepIdValidation>>;

export const getMultiFieldsValidation = (flowId: FlowId) =>
  isKeyOfObject(flowId, multiFieldsFlowValidation)
    ? multiFieldsFlowValidation[flowId]
    : undefined;
