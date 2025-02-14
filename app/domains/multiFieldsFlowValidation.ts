import type { z } from "zod";
import type { FlowId } from "./flowIds";
import { fluggastrechtMultiFieldsValidation } from "./fluggastrechte/formular/multiFieldsValidation";
import { fluggastrechtVorabcheckMultiFieldsValidation } from "./fluggastrechte/vorabcheck/multiFieldsValidation";

export type MultiFieldsValidationBaseSchema = z.ZodObject<
  Record<string, z.ZodTypeAny>
>;

export type FunctionMultiFieldsValidation = (
  baseSchema: MultiFieldsValidationBaseSchema,
) => z.ZodTypeAny;

export type MultiFieldsStepIdValidation = Record<
  string,
  FunctionMultiFieldsValidation
>;

const multiFieldsFlowValidation = {
  "/beratungshilfe/antrag": undefined,
  "/beratungshilfe/vorabcheck": undefined,
  "/geld-einklagen/vorabcheck": undefined,
  "/geld-einklagen/formular": undefined,
  "/fluggastrechte/vorabcheck": fluggastrechtVorabcheckMultiFieldsValidation,
  "/fluggastrechte/formular": fluggastrechtMultiFieldsValidation,
  "/prozesskostenhilfe/formular": undefined,
  "/schulden/kontopfaendung/wegweiser": undefined, // todo: validation if necessary
} as const satisfies Record<FlowId, MultiFieldsStepIdValidation | undefined>;

export const getMultiFieldsValidation = (flowId: FlowId) =>
  multiFieldsFlowValidation[flowId];
