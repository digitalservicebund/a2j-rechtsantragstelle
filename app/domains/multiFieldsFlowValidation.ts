import { geldEinklagenAnwaltschaftMultiFieldsValidation } from "~/domains/geldEinklagen/anwaltschaft/multiFieldsValidation";
import { erbscheinAnfrageMultiFieldsValidation } from "~/domains/nachlass/erbschein/anfrage/multiFieldsValidation";
import { isKeyOfObject } from "~/util/objects";
import type { FlowId } from "./flowIds";
import { fluggastrechtMultiFieldsValidation } from "./fluggastrechte/formular/multiFieldsValidation";
import { fluggastrechtVorabcheckMultiFieldsValidation } from "./fluggastrechte/vorabcheck/multiFieldsValidation";
import { geldEinklagenMultiFieldsValidation } from "./geldEinklagen/formular/multiFieldsValidation";
import { type MultiFieldsStepIdValidation } from "./types";

const multiFieldsFlowValidation = {
  "/fluggastrechte/vorabcheck":
    fluggastrechtVorabcheckMultiFieldsValidation as MultiFieldsStepIdValidation,
  "/fluggastrechte/formular":
    fluggastrechtMultiFieldsValidation as MultiFieldsStepIdValidation,
  "/geld-einklagen/formular":
    geldEinklagenMultiFieldsValidation as MultiFieldsStepIdValidation,
  "/geld-einklagen/anwaltschaft":
    geldEinklagenAnwaltschaftMultiFieldsValidation,
  "/erbschein/anfrage": erbscheinAnfrageMultiFieldsValidation,
} as const satisfies Partial<Record<FlowId, MultiFieldsStepIdValidation>>;

export const getMultiFieldsValidation = (flowId: FlowId) =>
  isKeyOfObject(flowId, multiFieldsFlowValidation)
    ? multiFieldsFlowValidation[flowId]
    : undefined;
