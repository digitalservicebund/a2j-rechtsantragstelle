import type { FlowId } from "./flowIds";
import { fluggastrechtMultiFieldsValidation } from "./fluggastrechte/formular/multiFieldsValidation";
import { fluggastrechtVorabcheckMultiFieldsValidation } from "./fluggastrechte/vorabcheck/multiFieldsValidation";
import { type MultiFieldsStepIdValidation } from "./types";

const multiFieldsFlowValidation = {
  "/beratungshilfe/antrag": undefined,
  "/beratungshilfe/vorabcheck": undefined,
  "/geld-einklagen/vorabcheck": undefined,
  "/fluggastrechte/vorabcheck":
    fluggastrechtVorabcheckMultiFieldsValidation as MultiFieldsStepIdValidation,
  "/fluggastrechte/formular":
    fluggastrechtMultiFieldsValidation as MultiFieldsStepIdValidation,
  "/prozesskostenhilfe/formular": undefined,
  "/kontopfaendung/wegweiser": undefined,
  "/geld-einklagen/formular": undefined,
} as const satisfies Record<FlowId, MultiFieldsStepIdValidation | undefined>;

export const getMultiFieldsValidation = (flowId: FlowId) =>
  multiFieldsFlowValidation[flowId];
