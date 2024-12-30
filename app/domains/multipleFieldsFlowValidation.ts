import type { z } from "zod";
import type { FlowId } from "./flowIds";
import { fluggastrechtMultipleFieldsValidation } from "./fluggastrechte/formular/multipleFieldsValidation";

export type MultipleFieldsValidationBaseSchema = z.ZodObject<
  Record<string, z.ZodTypeAny>
>;

export type FunctionMultipleFieldsValidation = (
  baseSchema: MultipleFieldsValidationBaseSchema,
) => z.ZodTypeAny;

export type MultipleFieldsStepIdValidation = Record<
  string,
  FunctionMultipleFieldsValidation
>;

const multipleFieldsFlowValidation = {
  "/beratungshilfe/antrag": undefined,
  "/beratungshilfe/vorabcheck": undefined,
  "/geld-einklagen/vorabcheck": undefined,
  "/geld-einklagen/formular": undefined,
  "/fluggastrechte/vorabcheck": undefined,
  "/fluggastrechte/formular": fluggastrechtMultipleFieldsValidation,
  "/prozesskostenhilfe/formular": undefined,
} as const satisfies Record<FlowId, MultipleFieldsStepIdValidation | undefined>;

export const getMultipleFieldsValidation = (flowId: FlowId) =>
  multipleFieldsFlowValidation[flowId];
