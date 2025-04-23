import type { z } from "zod";

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
