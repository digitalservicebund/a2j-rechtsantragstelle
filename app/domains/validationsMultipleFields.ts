import type { z } from "zod";
import type { FlowId } from "./flowIds";
import { fluggastrechtValidationMultipleFields } from "./fluggastrechte/formular/validationMultipleFields";

export type ValidationMultipleFieldsBaseSchema = z.ZodObject<
  Record<string, z.ZodTypeAny>
>;

export type ValidationFunctionMultipleFields = (
  baseSchema: ValidationMultipleFieldsBaseSchema,
) => z.ZodTypeAny;

export type ValidationMultipleFieldsPathName = Record<
  string,
  ValidationFunctionMultipleFields
>;

const validationMultipleFields = {
  "/beratungshilfe/antrag": undefined,
  "/beratungshilfe/vorabcheck": undefined,
  "/geld-einklagen/vorabcheck": undefined,
  "/geld-einklagen/formular": undefined,
  "/fluggastrechte/vorabcheck": undefined,
  "/fluggastrechte/formular": fluggastrechtValidationMultipleFields,
  "/prozesskostenhilfe/formular": undefined,
} as const satisfies Record<
  FlowId,
  ValidationMultipleFieldsPathName | undefined
>;

export const getValidationMultipleFields = (flowId: FlowId) =>
  validationMultipleFields[flowId];
