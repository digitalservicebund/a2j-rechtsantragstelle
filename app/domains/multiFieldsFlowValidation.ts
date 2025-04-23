import type { FlowId } from "./flowIds";
import { fluggastrechtMultiFieldsValidation } from "./fluggastrechte/formular/multiFieldsValidation";
import { fluggastrechtVorabcheckMultiFieldsValidation } from "./fluggastrechte/vorabcheck/multiFieldsValidation";
import { type MultiFieldsStepIdValidation } from "./types";

const multiFieldsFlowValidation = {
  "/beratungshilfe/antrag": undefined,
  "/beratungshilfe/vorabcheck": undefined,
  "/geld-einklagen/vorabcheck": undefined,
  "/geld-einklagen/formular": undefined,
  "/fluggastrechte/vorabcheck": fluggastrechtVorabcheckMultiFieldsValidation,
  "/fluggastrechte/formular": fluggastrechtMultiFieldsValidation,
  "/prozesskostenhilfe/formular": undefined,
  "/kontopfaendung/wegweiser": undefined,
} as const satisfies Record<FlowId, MultiFieldsStepIdValidation | undefined>;

export const getMultiFieldsValidation = (flowId: FlowId) =>
  multiFieldsFlowValidation[flowId];
