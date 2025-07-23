import type { z } from "zod";

export type SchemaObject = Record<string, z.ZodTypeAny>;

export type MultiFieldsValidationBaseSchema = z.ZodObject<SchemaObject>;

export type FunctionMultiFieldsValidation = (
  baseSchema: MultiFieldsValidationBaseSchema,
) => z.ZodTypeAny;

export type MultiFieldsStepIdValidation = Record<
  string,
  FunctionMultiFieldsValidation
>;
